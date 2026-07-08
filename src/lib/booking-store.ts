import { create } from "zustand";
import type {
  JourneySearchRequest,
  JourneySearchResponse,
  BookingResponse,
  Fare,
} from "@/types/eurostar";

interface BookingState {
  // Search
  searchParams: Partial<JourneySearchRequest>;
  searchResults: JourneySearchResponse | null;
  isSearching: boolean;

  // Selected journey
  selectedOutbound: { fare: Fare; legIndex: number } | null;
  selectedInbound: { fare: Fare; legIndex: number } | null;

  // Booking
  booking: BookingResponse | null;
  bookingStep: "search" | "select" | "passengers" | "payment" | "confirm" | "done";

  // Passengers
  passengerDetails: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
  }[];

  // Customer
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };

  // Actions
  setSearchParams: (params: Partial<JourneySearchRequest>) => void;
  search: () => Promise<void>;
  selectOutbound: (fare: Fare, legIndex: number) => void;
  selectInbound: (fare: Fare, legIndex: number) => void;
  createBooking: () => Promise<void>;
  setPassengerDetails: (
    passengers: BookingState["passengerDetails"]
  ) => void;
  setCustomerDetails: (customer: BookingState["customerDetails"]) => void;
  submitPassengers: () => Promise<void>;
  submitCustomer: () => Promise<void>;
  submitPayment: (paymentRef: string) => Promise<void>;
  confirmBooking: () => Promise<void>;
  setStep: (step: BookingState["bookingStep"]) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  searchParams: {
    adults: 1,
    children: 0,
    infants: 0,
    currency: "GBP",
  },
  searchResults: null,
  isSearching: false,
  selectedOutbound: null,
  selectedInbound: null,
  booking: null,
  bookingStep: "search",
  passengerDetails: [],
  customerDetails: { firstName: "", lastName: "", email: "" },

  setSearchParams: (params) =>
    set((s) => ({ searchParams: { ...s.searchParams, ...params } })),

  search: async () => {
    const { searchParams } = get();
    set({ isSearching: true });
    try {
      const res = await fetch("/api/eurostar/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ searchResults: data, bookingStep: "select" });
    } catch (error) {
      console.error("Search failed:", error);
      throw error;
    } finally {
      set({ isSearching: false });
    }
  },

  selectOutbound: (fare, legIndex) =>
    set({ selectedOutbound: { fare, legIndex } }),

  selectInbound: (fare, legIndex) =>
    set({ selectedInbound: { fare, legIndex } }),

  createBooking: async () => {
    const { selectedOutbound, selectedInbound, searchParams } = get();
    if (!selectedOutbound) return;

    const outLeg = selectedOutbound.fare.legs[selectedOutbound.legIndex];
    const passengerCount = (searchParams.adults || 1) + (searchParams.children || 0);

    const passengers = Array.from({ length: passengerCount }, (_, i) => ({
      id: `passenger_${i + 1}`,
      type: (i < (searchParams.adults || 1) ? "AD" : "CH") as "AD" | "CH",
    }));

    const segments: {
      origin: string;
      destination: string;
      direction: "outbound" | "inbound";
      startValidityDate: string;
      serviceName: string;
      serviceIdentifier: string;
      items: { passengerId: string; tariffCode: string }[];
    }[] = [
      {
        origin: outLeg.origin.uic,
        destination: outLeg.destination.uic,
        direction: "outbound",
        startValidityDate: outLeg.timing.departureDate,
        serviceName: outLeg.serviceName,
        serviceIdentifier: outLeg.serviceIdentifier,
        items: outLeg.products.map((p) => ({
          passengerId: p.passengerId,
          tariffCode: p.tariffCode,
        })),
      },
    ];

    if (selectedInbound) {
      const inLeg = selectedInbound.fare.legs[selectedInbound.legIndex];
      segments.push({
        origin: inLeg.origin.uic,
        destination: inLeg.destination.uic,
        direction: "inbound",
        startValidityDate: inLeg.timing.departureDate,
        serviceName: inLeg.serviceName,
        serviceIdentifier: inLeg.serviceIdentifier,
        items: inLeg.products.map((p) => ({
          passengerId: p.passengerId,
          tariffCode: p.tariffCode,
        })),
      });
    }

    const res = await fetch("/api/eurostar/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create",
        segments,
        currency: searchParams.currency || "GBP",
        passengers,
        fulfillmentMethodCode: "PAH",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Initialize passenger details
    const details = passengers.map((p) => ({
      id: p.id,
      firstName: "",
      lastName: "",
      email: "",
    }));

    set({ booking: data, passengerDetails: details, bookingStep: "passengers" });
  },

  setPassengerDetails: (passengers) => set({ passengerDetails: passengers }),
  setCustomerDetails: (customer) => set({ customerDetails: customer }),

  submitPassengers: async () => {
    const { booking, passengerDetails } = get();
    if (!booking) return;

    const res = await fetch("/api/eurostar/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updatePassengers",
        bookingReference: booking.reference,
        passengers: passengerDetails,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    set({ booking: data });
  },

  submitCustomer: async () => {
    const { booking, customerDetails } = get();
    if (!booking) return;

    const res = await fetch("/api/eurostar/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addCustomer",
        bookingReference: booking.reference,
        ...customerDetails,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    set({ booking: data, bookingStep: "payment" });
  },

  submitPayment: async (paymentRef) => {
    const { booking } = get();
    if (!booking?.balance) return;

    const res = await fetch("/api/eurostar/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addPayment",
        bookingReference: booking.reference,
        amount: booking.balance.remainingBalance,
        currency: booking.balance.currency,
        reference: paymentRef,
        method: "BAF",
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    set({ booking: data, bookingStep: "confirm" });
  },

  confirmBooking: async () => {
    const { booking } = get();
    if (!booking) return;

    const res = await fetch("/api/eurostar/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "confirm",
        bookingReference: booking.reference,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    set({ booking: data, bookingStep: "done" });
  },

  setStep: (step) => set({ bookingStep: step }),

  reset: () =>
    set({
      searchResults: null,
      selectedOutbound: null,
      selectedInbound: null,
      booking: null,
      bookingStep: "search",
      passengerDetails: [],
      customerDetails: { firstName: "", lastName: "", email: "" },
    }),
}));

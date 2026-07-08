// Eurostar API types based on official documentation

export interface Station {
  uic: string;
  shortCode: string;
  name: string;
}

export interface JourneySearchRequest {
  origin: string;
  destination: string;
  currency: string;
  outboundDate: string;
  inboundDate?: string;
  adults: number;
  seniors?: number;
  youths?: number;
  children: number;
  infants: number;
  contractCode?: string;
  productFamilies?: string[];
}

export interface StationInfo {
  uic: string;
  shortCode: string;
  shortName: string;
  timezone?: string;
}

export interface Timing {
  departs: string;
  arrives: string;
  duration: number;
  departureDate: string;
  arrivalDate: string;
}

export interface ServiceType {
  name: string;
  code: string;
}

export interface Product {
  name: string;
  passengerId: string;
  tariffCode: string;
  bucketCode: string;
  price: number;
}

export interface Leg {
  origin: StationInfo;
  destination: StationInfo;
  timing: Timing;
  serviceType: ServiceType;
  serviceName: string;
  serviceIdentifier: string;
  products: Product[];
}

export interface Fare {
  flexibilityLevel: number;
  seats: number;
  legs: Leg[];
}

export interface Journey {
  fares: Fare[];
}

export interface JourneyDirection {
  origin: StationInfo;
  destination: StationInfo;
  journeys: Journey[];
}

export interface JourneySearchResponse {
  outbound: JourneyDirection;
  inbound?: JourneyDirection;
}

// Create Booking
export interface BookingSegmentItem {
  passengerId: string;
  tariffCode: string;
}

export interface BookingSegment {
  origin: string;
  destination: string;
  direction: "outbound" | "inbound";
  startValidityDate: string;
  serviceName: string;
  serviceIdentifier: string;
  items: BookingSegmentItem[];
}

export interface BookingPassenger {
  id: string;
  type: "AD" | "SR" | "YH" | "CH"; // Adult, Senior, Youth, Child
}

export interface CreateBookingRequest {
  segments: BookingSegment[];
  currency: string;
  passengers: BookingPassenger[];
  fulfillmentMethodCode: "PAH";
  discountCards?: string[];
}

export interface Payment {
  id: string;
  amountWithCurrency: number;
  currency: string;
  currencyRate: string;
  reference: string;
  method: string;
  transactionTimestamp: string;
  paymentStatus: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PassengerDetail {
  id: string;
  type: string;
  firstName?: string;
  lastName?: string;
  disabilityType: string | null;
  loyaltyNumber?: string | null;
  email?: string;
  unformattedPhoneNumber?: {
    countryCode: string;
    number: string;
  };
}

export interface FulfillmentMethod {
  code: string;
  description: string;
  name: string;
}

export interface ProductFamily {
  name: string;
  code: string;
}

export interface BookingProduct {
  itemRef: string;
  name: string;
  tariffCode: string;
  price: number;
  isActive: boolean;
  isCancelled: boolean;
  passengerId: string;
}

export interface BookingResponse {
  reference: string;
  fulfillmentMethod: FulfillmentMethod[];
  productFamilies: ProductFamily[];
  payments?: Payment[];
  customer?: Customer;
  passengers: PassengerDetail[];
  outbound?: BookingDirectionDetail[];
  inbound?: BookingDirectionDetail[];
  balance?: {
    totalAmount: number;
    paidAmount: number;
    remainingBalance: number;
    currency: string;
  };
}

export interface BookingDirectionDetail {
  serviceType: ServiceType;
  serviceName: string;
  origin: StationInfo;
  destination: StationInfo;
  timing: Timing;
  products: BookingProduct[];
}

// Add Customer
export interface AddCustomerRequest {
  bookingReference: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Update Passengers
export interface UpdatePassengerRequest {
  bookingReference: string;
  passengers: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneCountryCode?: string;
    phoneNumber?: string;
    loyaltyNumber?: string;
  }[];
}

// Add Payment
export interface AddPaymentRequest {
  bookingReference: string;
  amount: number;
  currency: string;
  reference: string;
  method: string;
}

// Cancel
export interface CancelBookingRequest {
  bookingReference: string;
  itemRefs?: string[];
}

// Exchange/Rebook
export interface ExchangeSearchRequest {
  bookingReference: string;
  origin: string;
  destination: string;
  outboundDate: string;
  inboundDate?: string;
}

export interface RebookRequest {
  bookingReference: string;
  segments: BookingSegment[];
}

// Booking status enum
export type BookingStatus =
  | "provisional"
  | "temporarily-on-hold"
  | "on-hold"
  | "confirmed"
  | "in-aftersales"
  | "cancelled"
  | "pending-refund"
  | "overpaid"
  | "refunded";

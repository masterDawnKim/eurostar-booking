import type {
  Station,
  JourneySearchRequest,
  JourneySearchResponse,
  CreateBookingRequest,
  BookingResponse,
  AddCustomerRequest,
  UpdatePassengerRequest,
  AddPaymentRequest,
  CancelBookingRequest,
  ExchangeSearchRequest,
  RebookRequest,
} from "@/types/eurostar";

const SANDBOX_URL = "https://sandbox.eurostar.com";
const PRODUCTION_URL = "https://api.eurostar.com";

export class EurostarClient {
  private baseUrl: string;
  private apiKey: string;
  private market: string;

  constructor(options?: {
    apiKey?: string;
    market?: string;
    sandbox?: boolean;
  }) {
    this.baseUrl = options?.sandbox !== false ? SANDBOX_URL : PRODUCTION_URL;
    this.apiKey =
      options?.apiKey || process.env.EUROSTAR_API_KEY || "";
    this.market = options?.market || process.env.EUROSTAR_MARKET || "GB";
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: "GET" | "POST";
      body?: unknown;
    } = {}
  ): Promise<T> {
    const { method = "POST", body } = options;

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "x-market": this.market,
        "user-agent": "diplat-korea",
      },
      body: body ? JSON.stringify(body) : method === "GET" ? undefined : "{}",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new EurostarApiError(res.status, errorText, endpoint);
    }

    return res.json();
  }

  // === Stations ===
  async getStations(): Promise<Station[]> {
    return this.request<Station[]>("/stations", { method: "GET" });
  }

  // === Journey Search ===
  async searchJourneys(
    params: JourneySearchRequest
  ): Promise<JourneySearchResponse> {
    return this.request<JourneySearchResponse>("/journey-search", {
      body: params,
    });
  }

  // === Create Booking (provisional, 30 min hold) ===
  async createBooking(
    params: CreateBookingRequest
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>("/create-booking", {
      body: params,
    });
  }

  // === Add Customer ===
  async addCustomer(params: AddCustomerRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>("/add-customer", {
      body: params,
    });
  }

  // === Update Passengers ===
  async updatePassengers(
    params: UpdatePassengerRequest
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>("/update-passengers", {
      body: params,
    });
  }

  // === Add Payment ===
  async addPayment(params: AddPaymentRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>("/add-payment", {
      body: params,
    });
  }

  // === Confirm Booking ===
  async confirmBooking(bookingReference: string): Promise<BookingResponse> {
    return this.request<BookingResponse>("/confirm-booking", {
      body: { bookingReference },
    });
  }

  // === Hold Booking ===
  async holdBooking(bookingReference: string): Promise<BookingResponse> {
    return this.request<BookingResponse>("/hold-booking", {
      body: { bookingReference },
    });
  }

  // === Cancel Booking Items ===
  async cancelBookingItems(
    params: CancelBookingRequest
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>("/cancel-booking-items", {
      body: params,
    });
  }

  // === Confirm Cancel ===
  async confirmCancelBookingItems(
    bookingReference: string
  ): Promise<BookingResponse> {
    return this.request<BookingResponse>("/confirm-cancel-booking-items", {
      body: { bookingReference },
    });
  }

  // === Exchange Search ===
  async exchangeSearch(
    params: ExchangeSearchRequest
  ): Promise<JourneySearchResponse> {
    return this.request<JourneySearchResponse>("/exchange-search", {
      body: params,
    });
  }

  // === Rebook ===
  async rebook(params: RebookRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>("/rebook", {
      body: params,
    });
  }

  // === Void Booking ===
  async voidBooking(bookingReference: string): Promise<BookingResponse> {
    return this.request<BookingResponse>("/void-booking", {
      body: { bookingReference },
    });
  }

  // === Revert Changes ===
  async revertChanges(bookingReference: string): Promise<BookingResponse> {
    return this.request<BookingResponse>("/revert-changes", {
      body: { bookingReference },
    });
  }

  // === Tickets ===
  async getTickets(bookingReference: string): Promise<unknown> {
    return this.request("/tickets", {
      body: { bookingReference },
    });
  }

  // === Fare Conditions ===
  async getFareConditions(tariffCode: string): Promise<unknown> {
    return this.request("/get-fare-conditions", {
      body: { tariffCode },
    });
  }
}

export class EurostarApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    public endpoint: string
  ) {
    super(`Eurostar API error ${status} on ${endpoint}: ${body}`);
    this.name = "EurostarApiError";
  }
}

// Singleton for server-side usage
let _client: EurostarClient | null = null;
export function getEurostarClient(): EurostarClient {
  if (!_client) {
    _client = new EurostarClient({ sandbox: true });
  }
  return _client;
}

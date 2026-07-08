import { NextRequest, NextResponse } from "next/server";
import { getEurostarClient } from "@/lib/eurostar-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    const client = getEurostarClient();

    let result;
    switch (action) {
      case "create":
        result = await client.createBooking(params);
        break;
      case "addCustomer":
        result = await client.addCustomer(params);
        break;
      case "updatePassengers":
        result = await client.updatePassengers(params);
        break;
      case "addPayment":
        result = await client.addPayment(params);
        break;
      case "confirm":
        result = await client.confirmBooking(params.bookingReference);
        break;
      case "hold":
        result = await client.holdBooking(params.bookingReference);
        break;
      case "void":
        result = await client.voidBooking(params.bookingReference);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking action failed:", error);
    return NextResponse.json(
      { error: "Booking action failed", details: String(error) },
      { status: 500 }
    );
  }
}

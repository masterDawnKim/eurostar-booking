import { NextRequest, NextResponse } from "next/server";
import { getEurostarClient } from "@/lib/eurostar-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    const client = getEurostarClient();

    let result;
    switch (action) {
      case "cancel":
        result = await client.cancelBookingItems(params);
        break;
      case "confirmCancel":
        result = await client.confirmCancelBookingItems(
          params.bookingReference
        );
        break;
      case "revert":
        result = await client.revertChanges(params.bookingReference);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cancel action failed:", error);
    return NextResponse.json(
      { error: "Cancel action failed", details: String(error) },
      { status: 500 }
    );
  }
}

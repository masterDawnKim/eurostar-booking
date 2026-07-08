import { NextRequest, NextResponse } from "next/server";
import { getEurostarClient } from "@/lib/eurostar-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;
    const client = getEurostarClient();

    let result;
    switch (action) {
      case "search":
        result = await client.exchangeSearch(params);
        break;
      case "rebook":
        result = await client.rebook(params);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Exchange action failed:", error);
    return NextResponse.json(
      { error: "Exchange action failed", details: String(error) },
      { status: 500 }
    );
  }
}

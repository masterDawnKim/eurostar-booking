import { NextRequest, NextResponse } from "next/server";
import { getEurostarClient } from "@/lib/eurostar-client";
import type { JourneySearchRequest } from "@/types/eurostar";

export async function POST(request: NextRequest) {
  try {
    const body: JourneySearchRequest = await request.json();

    // Validate required fields
    if (!body.origin || !body.destination || !body.outboundDate) {
      return NextResponse.json(
        { error: "origin, destination, and outboundDate are required" },
        { status: 400 }
      );
    }

    const client = getEurostarClient();
    const results = await client.searchJourneys({
      ...body,
      adults: body.adults || 1,
      children: body.children || 0,
      infants: body.infants || 0,
      currency: body.currency || "GBP",
      contractCode: body.contractCode || "PUBLIC",
      productFamilies: body.productFamilies || ["PUB"],
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Journey search failed:", error);
    return NextResponse.json(
      { error: "Journey search failed", details: String(error) },
      { status: 500 }
    );
  }
}

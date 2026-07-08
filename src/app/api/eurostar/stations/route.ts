import { NextResponse } from "next/server";
import { getEurostarClient } from "@/lib/eurostar-client";

export async function GET() {
  try {
    const client = getEurostarClient();
    const stations = await client.getStations();
    return NextResponse.json(stations);
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    // Fallback to local station data
    const { EUROSTAR_STATIONS } = await import("@/lib/stations");
    return NextResponse.json(EUROSTAR_STATIONS);
  }
}

import { NextResponse } from "next/server";
import { calculateDistance, calculateFare, estimateDuration } from "@/lib/fare";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = body;

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return NextResponse.json(
        { success: false, error: "Missing coordinates" },
        { status: 400 }
      );
    }

    const distance = calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const duration = estimateDuration(distance);
    const fare = calculateFare(distance, duration);

    return NextResponse.json({
      success: true,
      data: {
        distance: Math.round(distance * 100) / 100,
        duration,
        fare,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to estimate fare";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

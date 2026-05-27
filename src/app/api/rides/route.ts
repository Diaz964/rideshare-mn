import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rideRequestSchema } from "@/lib/validations";
import { calculateDistance, calculateFare, estimateDuration } from "@/lib/fare";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = rideRequestSchema.parse(body);

    const distance = calculateDistance(
      validated.pickupLat,
      validated.pickupLng,
      validated.dropoffLat,
      validated.dropoffLng
    );
    const duration = estimateDuration(distance);
    const fare = calculateFare(distance, duration);

    const ride = await prisma.ride.create({
      data: {
        passengerId: session.id,
        pickupLat: validated.pickupLat,
        pickupLng: validated.pickupLng,
        pickupAddress: validated.pickupAddress,
        dropoffLat: validated.dropoffLat,
        dropoffLng: validated.dropoffLng,
        dropoffAddress: validated.dropoffAddress,
        estimatedFare: fare.totalFare,
        distance,
        duration,
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...ride, fareBreakdown: fare },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create ride";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const rides = await prisma.ride.findMany({
      where: {
        passengerId: session.id,
        ...(status ? { status: status as never } : {}),
      },
      include: {
        driver: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            vehicle: true,
          },
        },
      },
      orderBy: { requestedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: rides });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch rides";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: { select: { name: true, phone: true, avatarUrl: true } },
            vehicle: true,
          },
        },
        passenger: { select: { name: true, phone: true, avatarUrl: true } },
        rating: true,
      },
    });

    if (!ride) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ride });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch ride";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const ride = await prisma.ride.findUnique({ where: { id } });
    if (!ride) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 }
      );
    }

    let updatedRide;

    switch (action) {
      case "cancel":
        updatedRide = await prisma.ride.update({
          where: { id },
          data: { status: "CANCELLED", cancelledAt: new Date() },
        });
        break;

      case "accept": {
        const driver = await prisma.driver.findUnique({
          where: { userId: session.id },
        });
        if (!driver) {
          return NextResponse.json(
            { success: false, error: "Driver not found" },
            { status: 404 }
          );
        }
        updatedRide = await prisma.ride.update({
          where: { id },
          data: {
            status: "ACCEPTED",
            driverId: driver.id,
            acceptedAt: new Date(),
          },
        });
        await prisma.driver.update({
          where: { id: driver.id },
          data: { status: "ON_RIDE" },
        });
        break;
      }

      case "arriving":
        updatedRide = await prisma.ride.update({
          where: { id },
          data: { status: "DRIVER_ARRIVING" },
        });
        break;

      case "start":
        updatedRide = await prisma.ride.update({
          where: { id },
          data: { status: "IN_PROGRESS", startedAt: new Date() },
        });
        break;

      case "complete": {
        updatedRide = await prisma.ride.update({
          where: { id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            actualFare: ride.estimatedFare,
          },
        });
        if (ride.driverId) {
          await prisma.driver.update({
            where: { id: ride.driverId },
            data: {
              status: "AVAILABLE",
              totalRides: { increment: 1 },
              totalEarnings: { increment: ride.estimatedFare * 0.75 },
            },
          });
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: updatedRide });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update ride";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

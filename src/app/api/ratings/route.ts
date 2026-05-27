import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ratingSchema } from "@/lib/validations";

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
    const validated = ratingSchema.parse(body);

    const ride = await prisma.ride.findUnique({
      where: { id: validated.rideId },
      include: { driver: true },
    });

    if (!ride || ride.status !== "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Ride not found or not completed" },
        { status: 400 }
      );
    }

    const receiverId =
      session.role === "PASSENGER" && ride.driver
        ? ride.driver.userId
        : ride.passengerId;

    const rating = await prisma.rating.create({
      data: {
        rideId: validated.rideId,
        giverId: session.id,
        receiverId,
        score: validated.score,
        comment: validated.comment,
      },
    });

    if (session.role === "PASSENGER" && ride.driver) {
      const driverRatings = await prisma.rating.findMany({
        where: { receiverId: ride.driver.userId },
      });
      const avgRating =
        driverRatings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) /
        driverRatings.length;
      await prisma.driver.update({
        where: { id: ride.driver.id },
        data: { rating: Math.round(avgRating * 10) / 10 },
      });
    }

    return NextResponse.json({ success: true, data: rating });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create rating";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

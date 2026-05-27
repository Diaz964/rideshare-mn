import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "DRIVER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const driver = await prisma.driver.findUnique({
      where: { userId: session.id },
    });

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    const completedRides = await prisma.ride.findMany({
      where: { driverId: driver.id, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 50,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = completedRides
      .filter((r) => r.completedAt && r.completedAt >= today)
      .reduce((sum: number, r: { actualFare: number | null }) => sum + (r.actualFare || 0) * 0.75, 0);

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const weekEarnings = completedRides
      .filter((r: { completedAt: Date | null }) => r.completedAt && r.completedAt >= weekStart)
      .reduce((sum: number, r: { actualFare: number | null }) => sum + (r.actualFare || 0) * 0.75, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings: driver.totalEarnings,
        todayEarnings: Math.round(todayEarnings * 100) / 100,
        weekEarnings: Math.round(weekEarnings * 100) / 100,
        totalRides: driver.totalRides,
        recentRides: completedRides.slice(0, 10),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch earnings";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

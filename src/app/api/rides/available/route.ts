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

    const rides = await prisma.ride.findMany({
      where: { status: "REQUESTED" },
      include: {
        passenger: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { requestedAt: "desc" },
      take: 10,
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

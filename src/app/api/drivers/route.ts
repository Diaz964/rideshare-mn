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
      include: {
        vehicle: true,
        user: { select: { name: true, email: true, phone: true, avatarUrl: true } },
        rides: {
          orderBy: { requestedAt: "desc" },
          take: 10,
          include: {
            passenger: { select: { name: true } },
          },
        },
      },
    });

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: driver });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch driver";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DRIVER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, currentLat, currentLng } = body;

    const driver = await prisma.driver.update({
      where: { userId: session.id },
      data: {
        ...(status ? { status } : {}),
        ...(currentLat !== undefined ? { currentLat } : {}),
        ...(currentLng !== undefined ? { currentLng } : {}),
      },
    });

    return NextResponse.json({ success: true, data: driver });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update driver";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

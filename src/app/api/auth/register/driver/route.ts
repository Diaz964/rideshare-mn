import { NextResponse } from "next/server";
import { registerUser, createSession } from "@/lib/auth";
import { driverRegisterSchema } from "@/lib/validations";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = driverRegisterSchema.parse(body);

    const user = await registerUser(
      validated.email,
      validated.password,
      validated.name,
      validated.phone,
      UserRole.DRIVER
    );

    await prisma.driver.create({
      data: {
        userId: user.id,
        licenseNumber: validated.licenseNumber,
        licenseExpiry: new Date(validated.licenseExpiry),
        vehicle: {
          create: {
            make: validated.vehicleMake,
            model: validated.vehicleModel,
            year: validated.vehicleYear,
            color: validated.vehicleColor,
            licensePlate: validated.licensePlate,
          },
        },
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

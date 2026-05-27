import { NextResponse } from "next/server";
import { registerUser, createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { UserRole } from "@/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const user = await registerUser(
      validated.email,
      validated.password,
      validated.name,
      validated.phone,
      UserRole.PASSENGER
    );

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

import { NextResponse } from "next/server";

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || "";
const SQUARE_API_URL = "https://connect.squareupsandbox.com/v2/payments";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourceId, amount, pickup, destination, rideType } = body;

    if (!sourceId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      );
    }

    const idempotencyKey = crypto.randomUUID();

    const paymentResponse = await fetch(SQUARE_API_URL, {
      method: "POST",
      headers: {
        "Square-Version": "2024-01-18",
        Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: idempotencyKey,
        amount_money: {
          amount,
          currency: "USD",
        },
        note: `XELAJU ride: ${rideType} from ${pickup} to ${destination}`,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentResponse.ok && paymentData.payment) {
      return NextResponse.json({
        success: true,
        paymentId: paymentData.payment.id,
        status: paymentData.payment.status,
      });
    } else {
      const errorDetail =
        paymentData.errors?.[0]?.detail || "Payment processing failed";
      return NextResponse.json(
        { success: false, error: errorDetail },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

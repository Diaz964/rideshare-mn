"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

declare global {
  interface Window {
    Square?: {
      payments: (
        appId: string,
        locationId: string
      ) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: () => Promise<SquareCard>;
}

interface SquareCard {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message: string }> }>;
  destroy: () => Promise<void>;
}

const SQUARE_APP_ID = "sandbox-sq0idb-HKzxkoVJeTcCLlnzoYr-aw";
const SQUARE_LOCATION_ID = "LK9Z0XS4X55MS";

interface PaymentFormProps {
  pickup: string;
  destination: string;
  rideType: string;
  price: string;
}

export default function PaymentForm({
  pickup,
  destination,
  rideType,
  price,
}: PaymentFormProps) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const cardRef = useRef<SquareCard | null>(null);
  const initRef = useRef(false);

  const initializeCard = useCallback(async () => {
    if (initRef.current) return;
    initRef.current = true;

    try {
      if (!window.Square) {
        setError("Square payments failed to load. Please refresh the page.");
        setLoading(false);
        return;
      }

      const payments = await window.Square.payments(
        SQUARE_APP_ID,
        SQUARE_LOCATION_ID
      );
      const card = await payments.card();
      await card.attach("#card-container");
      cardRef.current = card;
      setLoading(false);
    } catch (err) {
      console.error("Failed to initialize Square card:", err);
      setError("Failed to initialize payment form. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src*="squareup.com"]'
    );
    if (existingScript) {
      if (window.Square) {
        // Script already loaded and Square is available — schedule init
        const timer = setTimeout(initializeCard, 0);
        return () => clearTimeout(timer);
      } else {
        existingScript.addEventListener("load", initializeCard);
        return () =>
          existingScript.removeEventListener("load", initializeCard);
      }
    }

    const script = document.createElement("script");
    script.src = "https://sandbox.web.squareup.com/v1/square.js";
    script.onload = () => initializeCard();
    script.onerror = () => {
      setError("Failed to load payment SDK. Please check your connection.");
      setLoading(false);
    };
    document.head.appendChild(script);
  }, [initializeCard]);

  async function handlePayment() {
    if (!cardRef.current) return;
    setProcessing(true);
    setError(null);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status === "OK" && result.token) {
        const response = await fetch("/api/payment.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: result.token,
            amount: Math.round(parseFloat(price) * 100),
            pickup,
            destination,
            rideType,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error || "Payment failed. Please try again.");
        }
      } else {
        const errorMessage =
          result.errors?.map((e) => e.message).join(", ") ||
          "Card verification failed.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-burgundy-dark mb-2">
          Ride Booked!
        </h2>
        <p className="text-gray-600 mb-2">
          Your {rideType} ride has been confirmed.
        </p>
        <p className="text-sm text-gray-500">
          {pickup} → {destination}
        </p>
        <p className="text-lg font-semibold text-burgundy mt-4">
          Charged: ${price}
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-burgundy text-white font-semibold px-6 py-3 rounded-full hover:bg-burgundy-dark transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ride summary */}
      <div className="bg-burgundy-50 rounded-xl p-4 border border-burgundy-100">
        <h3 className="font-semibold text-burgundy-dark mb-2">Ride Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Pickup:</span> {pickup}
          </p>
          <p>
            <span className="font-medium">Destination:</span> {destination}
          </p>
          <p>
            <span className="font-medium">Ride:</span>{" "}
            {rideType.charAt(0).toUpperCase() + rideType.slice(1)}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-burgundy-200">
          <span className="text-xl font-bold text-burgundy">${price}</span>
        </div>
      </div>

      {/* Card input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div
          id="card-container"
          className="min-h-[90px] rounded-xl border border-burgundy-200 p-1"
        >
          {loading && (
            <div className="flex items-center justify-center h-[80px] text-sm text-gray-400">
              Loading payment form...
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || processing}
        className="w-full py-4 rounded-full bg-burgundy text-white font-semibold text-lg hover:bg-burgundy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
      >
        {processing ? "Processing..." : `Pay $${price}`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Payments are processed securely by Square. Your card details are never
        stored on our servers.
      </p>
    </div>
  );
}

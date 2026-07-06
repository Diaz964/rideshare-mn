"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const destination = searchParams.get("destination") || "";
  const rideType = searchParams.get("ride") || "";
  const price = searchParams.get("price") || "0.00";
  const name = searchParams.get("name") || "";
  const paymentId = searchParams.get("paymentId") || "";

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-18297524930/RgkiCJfl8cscEMKl-JRE",
        value: parseFloat(price),
        currency: "USD",
        transaction_id: paymentId,
      });
    }
  }, [price, paymentId]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-burgundy-100 p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-burgundy-dark mb-3">
            Thank You for Your Purchase!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your ride has been confirmed and a driver will be assigned shortly.
          </p>

          <div className="bg-burgundy-50 rounded-xl p-5 border border-burgundy-100 text-left mb-6">
            <h3 className="font-semibold text-burgundy-dark mb-3 text-center">
              Ride Details
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              {name && (
                <p>
                  <span className="font-medium text-gray-700">Rider:</span>{" "}
                  {name}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">Pickup:</span>{" "}
                {pickup}
              </p>
              <p>
                <span className="font-medium text-gray-700">Destination:</span>{" "}
                {destination}
              </p>
              <p>
                <span className="font-medium text-gray-700">Ride Type:</span>{" "}
                {rideType.charAt(0).toUpperCase() + rideType.slice(1)}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-burgundy-200 text-center">
              <span className="text-2xl font-bold text-burgundy">${price}</span>
              <p className="text-xs text-gray-400 mt-1">Amount charged</p>
            </div>
            {paymentId && (
              <p className="text-xs text-gray-400 mt-3 text-center">
                Payment ID: {paymentId}
              </p>
            )}
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
            <p className="text-green-700 font-medium text-sm">
              A confirmation has been sent. Your driver will contact you before
              pickup.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/book"
              className="inline-block w-full py-3 rounded-full bg-burgundy text-white font-semibold text-lg hover:bg-burgundy-dark transition-colors shadow-lg"
            >
              Book Another Ride
            </Link>
            <Link
              href="/"
              className="inline-block w-full py-3 rounded-full border-2 border-burgundy text-burgundy font-semibold text-lg hover:bg-burgundy-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="tel:6125582880"
                className="text-burgundy font-medium hover:underline"
              >
                Call (612) 558-2880
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}

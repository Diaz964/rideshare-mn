"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import PaymentForm from "./PaymentForm";

function PaymentContent() {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const destination = searchParams.get("destination") || "";
  const rideType = searchParams.get("ride") || "";
  const price = searchParams.get("price") || "0.00";
  const riderName = searchParams.get("name") || "";
  const riderPhone = searchParams.get("phone") || "";

  if (!pickup || !destination || !rideType) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-600">
            Missing ride details.{" "}
            <a href="/book" className="text-burgundy font-medium underline">
              Go back to booking
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-burgundy-dark mb-2">Payment</h1>
        <p className="text-gray-600 mb-8">
          Complete your payment to confirm your ride.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-burgundy-100 p-6">
          <PaymentForm
            pickup={pickup}
            destination={destination}
            rideType={rideType}
            price={price}
            riderName={riderName}
            riderPhone={riderPhone}
          />
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-140px)] bg-burgundy-50 py-12 px-6 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}

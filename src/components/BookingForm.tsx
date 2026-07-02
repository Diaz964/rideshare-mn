"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: Record<string, unknown>
          ) => GoogleAutocomplete;
        };
      };
    };
    initGoogleMaps?: () => void;
  }
}

interface GoogleAutocomplete {
  addListener: (event: string, callback: () => void) => void;
  getPlace: () => { formatted_address?: string; name?: string };
}

const GOOGLE_MAPS_API_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";

const RIDE_OPTIONS = [
  {
    id: "standard",
    name: "Standard",
    description: "Affordable everyday rides",
    price: 12.5,
    eta: "5 min",
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Extra legroom & quiet ride",
    price: 18.0,
    eta: "8 min",
  },
  {
    id: "xl",
    name: "XL",
    description: "Up to 6 passengers",
    price: 24.0,
    eta: "10 min",
  },
];

export default function BookingForm() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedRide, setSelectedRide] = useState("");
  const pickupRef = useRef<HTMLInputElement>(null);
  const destRef = useRef<HTMLInputElement>(null);
  const mapsLoadedRef = useRef(false);

  const initAutocomplete = useCallback(() => {
    if (!window.google?.maps?.places) return;
    if (pickupRef.current) {
      const pickupAc = new window.google.maps.places.Autocomplete(
        pickupRef.current,
        { types: ["geocode", "establishment"] }
      );
      pickupAc.addListener("place_changed", () => {
        const place = pickupAc.getPlace();
        setPickup(place.formatted_address || place.name || "");
      });
    }
    if (destRef.current) {
      const destAc = new window.google.maps.places.Autocomplete(
        destRef.current,
        { types: ["geocode", "establishment"] }
      );
      destAc.addListener("place_changed", () => {
        const place = destAc.getPlace();
        setDestination(place.formatted_address || place.name || "");
      });
    }
  }, []);

  useEffect(() => {
    if (mapsLoadedRef.current) return;
    mapsLoadedRef.current = true;

    if (window.google?.maps?.places) {
      const timer = setTimeout(initAutocomplete, 0);
      return () => clearTimeout(timer);
    }

    window.initGoogleMaps = () => initAutocomplete();
    const existing = document.querySelector('script[src*="maps.googleapis.com"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [initAutocomplete]);

  function handleContinue() {
    if (!pickup || !destination || !selectedRide) return;
    const ride = RIDE_OPTIONS.find((r) => r.id === selectedRide);
    if (!ride) return;
    const params = new URLSearchParams({
      pickup,
      destination,
      ride: ride.id,
      price: ride.price.toFixed(2),
    });
    router.push(`/book/payment?${params.toString()}`);
  }

  return (
    <div className="space-y-8">
      {/* Location inputs */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="pickup"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pickup Location
          </label>
          <input
            ref={pickupRef}
            id="pickup"
            type="text"
            placeholder="Enter pickup address"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination
          </label>
          <input
            ref={destRef}
            id="destination"
            type="text"
            placeholder="Enter destination address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Ride options */}
      {pickup && destination && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-burgundy-dark">
            Choose Your Ride
          </h3>
          {RIDE_OPTIONS.map((ride) => (
            <button
              key={ride.id}
              onClick={() => setSelectedRide(ride.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                selectedRide === ride.id
                  ? "border-burgundy bg-burgundy-50"
                  : "border-burgundy-100 hover:border-burgundy-300"
              }`}
            >
              <div>
                <div className="font-semibold text-gray-900">{ride.name}</div>
                <div className="text-sm text-gray-500">{ride.description}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-burgundy">
                  ${ride.price.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400">{ride.eta}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Continue button */}
      <button
        onClick={handleContinue}
        disabled={!pickup || !destination || !selectedRide}
        className="w-full py-4 rounded-full bg-burgundy text-white font-semibold text-lg hover:bg-burgundy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
      >
        Continue to Payment
      </button>
    </div>
  );
}

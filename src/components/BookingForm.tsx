"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface NominatimResult {
  display_name: string;
  place_id: number;
}

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
  const [pickupSuggestions, setPickupSuggestions] = useState<NominatimResult[]>(
    []
  );
  const [destSuggestions, setDestSuggestions] = useState<NominatimResult[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const pickupRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const searchAddress = useCallback(
    async (
      query: string,
      setter: (results: NominatimResult[]) => void,
      showSetter: (show: boolean) => void
    ) => {
      if (query.length < 3) {
        setter([]);
        showSetter(false);
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data: NominatimResult[] = await res.json();
        setter(data);
        showSetter(data.length > 0);
      } catch {
        setter([]);
        showSetter(false);
      }
    },
    []
  );

  function handlePickupChange(value: string) {
    setPickup(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value, setPickupSuggestions, setShowPickupDropdown);
    }, 300);
  }

  function handleDestChange(value: string) {
    setDestination(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value, setDestSuggestions, setShowDestDropdown);
    }, 300);
  }

  function selectPickup(result: NominatimResult) {
    setPickup(result.display_name);
    setShowPickupDropdown(false);
    setPickupSuggestions([]);
  }

  function selectDest(result: NominatimResult) {
    setDestination(result.display_name);
    setShowDestDropdown(false);
    setDestSuggestions([]);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickupRef.current && !pickupRef.current.contains(e.target as Node)) {
        setShowPickupDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div ref={pickupRef} className="relative">
          <label
            htmlFor="pickup"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pickup Location
          </label>
          <input
            id="pickup"
            type="text"
            placeholder="Enter pickup address"
            value={pickup}
            onChange={(e) => handlePickupChange(e.target.value)}
            onFocus={() => {
              if (pickupSuggestions.length > 0) setShowPickupDropdown(true);
            }}
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          {showPickupDropdown && pickupSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-burgundy-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
              {pickupSuggestions.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => selectPickup(s)}
                  className="px-4 py-3 hover:bg-burgundy-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div ref={destRef} className="relative">
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Destination
          </label>
          <input
            id="destination"
            type="text"
            placeholder="Enter destination address"
            value={destination}
            onChange={(e) => handleDestChange(e.target.value)}
            onFocus={() => {
              if (destSuggestions.length > 0) setShowDestDropdown(true);
            }}
            autoComplete="off"
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
          {showDestDropdown && destSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-burgundy-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-y-auto">
              {destSuggestions.map((s) => (
                <li
                  key={s.place_id}
                  onClick={() => selectDest(s)}
                  className="px-4 py-3 hover:bg-burgundy-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
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

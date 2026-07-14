"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Fare, DEFAULT_FARES, fetchFares, computeFarePrice } from "@/lib/fares";

interface NominatimResult {
  display_name: string;
  place_id: number;
  lat: string;
  lon: string;
}

const RIDE_DESCRIPTIONS: Record<string, string> = {
  standard: "Affordable everyday rides",
  comfort: "Extra legroom & quiet ride",
  xl: "Up to 6 passengers",
};

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface RideOption {
  id: string;
  name: string;
  description: string;
  eta: string;
  price: number;
}

export default function BookingForm() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [riderName, setRiderName] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [selectedRide, setSelectedRide] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<NominatimResult[]>(
    []
  );
  const [destSuggestions, setDestSuggestions] = useState<NominatimResult[]>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [destCoords, setDestCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [rideOptions, setRideOptions] = useState<RideOption[]>([]);
  const [fares, setFares] = useState<Fare[]>(DEFAULT_FARES);
  const pickupRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    fetchFares().then(setFares);
  }, []);

  useEffect(() => {
    if (pickupCoords && destCoords) {
      const miles = haversineDistance(
        pickupCoords.lat,
        pickupCoords.lon,
        destCoords.lat,
        destCoords.lon
      );
      const routeMiles = miles * 1.3;
      const estMinutes = Math.max(5, Math.round(routeMiles * 2));
      setDistance(routeMiles);
      setRideOptions(
        fares.map((fare) => ({
          id: fare.id,
          name: fare.name,
          description: RIDE_DESCRIPTIONS[fare.id] ?? "",
          eta: `${estMinutes} min`,
          price: computeFarePrice(fare, routeMiles, estMinutes),
        }))
      );
    } else {
      setDistance(null);
      setRideOptions([]);
      setSelectedRide("");
    }
  }, [pickupCoords, destCoords, fares]);

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
    setPickupCoords(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value, setPickupSuggestions, setShowPickupDropdown);
    }, 300);
  }

  function handleDestChange(value: string) {
    setDestination(value);
    setDestCoords(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAddress(value, setDestSuggestions, setShowDestDropdown);
    }, 300);
  }

  function selectPickup(result: NominatimResult) {
    setPickup(result.display_name);
    setPickupCoords({ lat: parseFloat(result.lat), lon: parseFloat(result.lon) });
    setShowPickupDropdown(false);
    setPickupSuggestions([]);
  }

  function selectDest(result: NominatimResult) {
    setDestination(result.display_name);
    setDestCoords({ lat: parseFloat(result.lat), lon: parseFloat(result.lon) });
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
    if (!pickup || !destination || !selectedRide || !riderName || !riderPhone) return;
    const ride = rideOptions.find((r) => r.id === selectedRide);
    if (!ride) return;
    const params = new URLSearchParams({
      pickup,
      destination,
      ride: ride.id,
      price: ride.price.toFixed(2),
      name: riderName,
      phone: riderPhone,
    });
    router.push(`/book/payment/?${params.toString()}`);
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

      {/* Rider info */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="riderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Name
          </label>
          <input
            id="riderName"
            type="text"
            placeholder="Full name"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
        <div>
          <label
            htmlFor="riderPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Phone Number
          </label>
          <input
            id="riderPhone"
            type="tel"
            placeholder="(555) 123-4567"
            value={riderPhone}
            onChange={(e) => setRiderPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Distance info */}
      {distance !== null && (
        <div className="bg-burgundy-50 rounded-xl p-3 border border-burgundy-100 text-center">
          <span className="text-sm text-gray-600">
            Estimated distance:{" "}
            <span className="font-semibold text-burgundy">
              {distance.toFixed(1)} miles
            </span>
          </span>
        </div>
      )}

      {/* Ride options */}
      {rideOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-burgundy-dark">
            Choose Your Ride
          </h3>
          {rideOptions.map((ride) => (
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
        disabled={!pickup || !destination || !selectedRide || !riderName || !riderPhone}
        className="w-full py-4 rounded-full bg-burgundy text-white font-semibold text-lg hover:bg-burgundy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
      >
        Continue to Payment
      </button>
    </div>
  );
}

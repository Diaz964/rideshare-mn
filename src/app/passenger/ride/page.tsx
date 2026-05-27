"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useRideStore } from "@/store/useRideStore";
import toast from "react-hot-toast";
import { MapPin, Navigation, DollarSign, Clock, Car } from "lucide-react";

const MapView = dynamic(
  () => import("@/components/maps/MapView").then((mod) => mod.MapView),
  { ssr: false, loading: () => <div className="w-full h-[400px] bg-gray-200 rounded-xl animate-pulse" /> }
);

export default function RideBookingPage() {
  const { pickup, dropoff, fareEstimate, currentRideId, rideStatus, setPickup, setDropoff, setFareEstimate, setCurrentRide } = useRideStore();
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [selectingFor, setSelectingFor] = useState<"pickup" | "dropoff">("pickup");
  const [isEstimating, setIsEstimating] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const location = { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
      if (selectingFor === "pickup") {
        setPickup(location);
        setPickupAddress(location.address);
      } else {
        setDropoff(location);
        setDropoffAddress(location.address);
      }
    },
    [selectingFor, setPickup, setDropoff]
  );

  const handleEstimate = async () => {
    if (!pickup || !dropoff) {
      toast.error("Please select both pickup and dropoff locations");
      return;
    }

    setIsEstimating(true);
    try {
      const res = await fetch("/api/rides/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          dropoffLat: dropoff.lat,
          dropoffLng: dropoff.lng,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFareEstimate(data.data.fare);
        toast.success("Fare estimated!");
      } else {
        toast.error(data.error || "Failed to estimate");
      }
    } catch {
      toast.error("Failed to get estimate");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !dropoff) return;

    setIsBooking(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          pickupAddress: pickupAddress || pickup.address,
          dropoffLat: dropoff.lat,
          dropoffLng: dropoff.lng,
          dropoffAddress: dropoffAddress || dropoff.address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentRide(data.data.id, "REQUESTED");
        toast.success("Ride requested! Looking for a driver...");
      } else {
        toast.error(data.error || "Failed to book ride");
      }
    } catch {
      toast.error("Failed to book ride");
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelRide = async () => {
    if (!currentRideId) return;

    try {
      const res = await fetch(`/api/rides/${currentRideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentRide(null, null);
        toast.success("Ride cancelled");
      }
    } catch {
      toast.error("Failed to cancel ride");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Ride</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[500px] rounded-xl overflow-hidden shadow-md">
            <MapView
              pickup={pickup}
              dropoff={dropoff}
              onMapClick={handleMapClick}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Click on the map to set {selectingFor === "pickup" ? "pickup" : "dropoff"} location
          </p>
        </div>

        <div className="space-y-4">
          {currentRideId ? (
            <Card>
              <div className="text-center space-y-4">
                <Car className="h-12 w-12 text-purple-600 mx-auto animate-pulse" />
                <h3 className="text-lg font-semibold">
                  {rideStatus === "REQUESTED" && "Looking for a driver..."}
                  {rideStatus === "ACCEPTED" && "Driver is on the way!"}
                  {rideStatus === "DRIVER_ARRIVING" && "Driver is arriving!"}
                  {rideStatus === "IN_PROGRESS" && "You're on your way!"}
                </h3>
                <p className="text-sm text-gray-500">Ride ID: {currentRideId.slice(0, 8)}...</p>
                {(rideStatus === "REQUESTED" || rideStatus === "ACCEPTED") && (
                  <Button variant="danger" onClick={handleCancelRide} className="w-full">
                    Cancel Ride
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <h3 className="text-lg font-semibold mb-4">Route Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <Input
                        placeholder="Pickup location"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        onFocus={() => setSelectingFor("pickup")}
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <Input
                        placeholder="Dropoff location"
                        value={dropoffAddress}
                        onChange={(e) => setDropoffAddress(e.target.value)}
                        onFocus={() => setSelectingFor("dropoff")}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleEstimate}
                    variant="secondary"
                    className="w-full"
                    isLoading={isEstimating}
                    disabled={!pickup || !dropoff}
                  >
                    Get Fare Estimate
                  </Button>
                </div>
              </Card>

              {fareEstimate && (
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Fare Estimate</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base fare</span>
                      <span>${fareEstimate.baseFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span>${fareEstimate.distanceFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span>${fareEstimate.timeFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking fee</span>
                      <span>${fareEstimate.bookingFee.toFixed(2)}</span>
                    </div>
                    {fareEstimate.surgeMultiplier > 1 && (
                      <div className="flex justify-between text-orange-600">
                        <span>Surge</span>
                        <span>{fareEstimate.surgeMultiplier}x</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-purple-600">
                        ${fareEstimate.totalFare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleBookRide}
                    className="w-full mt-4"
                    size="lg"
                    isLoading={isBooking}
                  >
                    Book Ride - ${fareEstimate.totalFare.toFixed(2)}
                  </Button>
                </Card>
              )}

              <Card className="bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">No hidden fees</p>
                    <p className="text-xs text-purple-700">What you see is what you pay</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Quick pickup</p>
                    <p className="text-xs text-purple-700">Average wait time: 3-5 minutes</p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

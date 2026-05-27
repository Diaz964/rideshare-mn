"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Power, MapPin, Navigation, DollarSign, Car, Clock } from "lucide-react";

interface AvailableRide {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  distance: number;
  duration: number;
  passenger: { name: string };
  requestedAt: string;
}

export default function DriverDashboardPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] = useState<AvailableRide[]>([]);
  const [currentRide, setCurrentRide] = useState<AvailableRide | null>(null);
  const [rideStatus, setRideStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailableRides = useCallback(async () => {
    if (!isOnline) return;
    try {
      const res = await fetch("/api/rides/available");
      const data = await res.json();
      if (data.success) {
        setAvailableRides(data.data);
      }
    } catch {
      // silently fail
    }
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline) return;
    const doFetch = () => { fetchAvailableRides(); };
    doFetch();
    const interval = setInterval(doFetch, 10000);
    return () => clearInterval(interval);
  }, [isOnline, fetchAvailableRides]);

  const toggleOnline = async () => {
    try {
      const newStatus = isOnline ? "OFFLINE" : "AVAILABLE";
      const res = await fetch("/api/drivers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOnline(!isOnline);
        toast.success(isOnline ? "You're now offline" : "You're now online!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const acceptRide = async (ride: AvailableRide) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/rides/${ride.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentRide(ride);
        setRideStatus("ACCEPTED");
        setAvailableRides([]);
        toast.success("Ride accepted!");
      }
    } catch {
      toast.error("Failed to accept ride");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRideStatus = async (action: string) => {
    if (!currentRide) return;
    try {
      const res = await fetch(`/api/rides/${currentRide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        if (action === "arriving") setRideStatus("DRIVER_ARRIVING");
        if (action === "start") setRideStatus("IN_PROGRESS");
        if (action === "complete") {
          setCurrentRide(null);
          setRideStatus(null);
          toast.success("Ride completed! Payment processed.");
        }
      }
    } catch {
      toast.error("Failed to update ride");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
        <Button
          onClick={toggleOnline}
          variant={isOnline ? "danger" : "primary"}
          className="flex items-center gap-2"
        >
          <Power className="h-4 w-4" />
          {isOnline ? "Go Offline" : "Go Online"}
        </Button>
      </div>

      <div className={`mb-6 p-4 rounded-xl text-center ${isOnline ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}>
        <div className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
        <span className={`font-medium ${isOnline ? "text-green-800" : "text-gray-600"}`}>
          {isOnline ? "Online - Accepting rides" : "Offline"}
        </span>
      </div>

      {currentRide ? (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-purple-600" />
            Current Ride
          </h3>
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Passenger:</span>
              <span className="text-sm">{currentRide.passenger.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">{currentRide.pickupAddress}</span>
            </div>
            <div className="flex items-start gap-2">
              <Navigation className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span className="text-sm">{currentRide.dropoffAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold">
                Fare: ${currentRide.estimatedFare.toFixed(2)} (You earn: ${(currentRide.estimatedFare * 0.75).toFixed(2)})
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {rideStatus === "ACCEPTED" && (
              <Button onClick={() => updateRideStatus("arriving")} className="flex-1">
                Arriving at Pickup
              </Button>
            )}
            {rideStatus === "DRIVER_ARRIVING" && (
              <Button onClick={() => updateRideStatus("start")} className="flex-1">
                Start Ride
              </Button>
            )}
            {rideStatus === "IN_PROGRESS" && (
              <Button onClick={() => updateRideStatus("complete")} className="flex-1" variant="primary">
                Complete Ride
              </Button>
            )}
          </div>
        </Card>
      ) : isOnline ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Rides ({availableRides.length})
          </h2>
          {availableRides.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No rides available. Stay online and new requests will appear here.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <Card key={ride.id}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{ride.passenger.name}</span>
                        <span>&bull;</span>
                        <span>{ride.distance?.toFixed(1)} mi</span>
                        <span>&bull;</span>
                        <span>{ride.duration} min</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{ride.pickupAddress}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{ride.dropoffAddress}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-green-600">
                        ${(ride.estimatedFare * 0.75).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">your earnings</p>
                      <Button
                        onClick={() => acceptRide(ride)}
                        size="sm"
                        className="mt-2"
                        isLoading={isLoading}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <Power className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">You&apos;re Offline</h3>
            <p className="text-gray-400">Go online to start accepting ride requests</p>
          </div>
        </Card>
      )}
    </div>
  );
}

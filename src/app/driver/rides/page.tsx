"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { MapPin, Navigation, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface DriverRide {
  id: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  actualFare: number | null;
  requestedAt: string;
  completedAt: string | null;
  passenger: { name: string };
}

export default function DriverRidesPage() {
  const [rides, setRides] = useState<DriverRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRides() {
      try {
        const res = await fetch("/api/drivers");
        const data = await res.json();
        if (data.success && data.data.rides) {
          setRides(data.data.rides);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchRides();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Rides</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Rides</h1>

      {rides.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No rides completed yet. Go online to start accepting rides!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {ride.status === "COMPLETED" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {ride.passenger.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(ride.requestedAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{ride.pickupAddress}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{ride.dropoffAddress}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    +${((ride.actualFare || ride.estimatedFare) * 0.75).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">{ride.status}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

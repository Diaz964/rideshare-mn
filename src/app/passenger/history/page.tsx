"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { MapPin, Navigation, Star, Clock } from "lucide-react";
import { format } from "date-fns";

interface Ride {
  id: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedFare: number;
  actualFare: number | null;
  requestedAt: string;
  completedAt: string | null;
  driver: {
    user: { name: string };
    vehicle: { make: string; model: string; color: string } | null;
  } | null;
}

export default function RideHistoryPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRides() {
      try {
        const res = await fetch("/api/rides");
        const data = await res.json();
        if (data.success) {
          setRides(data.data);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchRides();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Ride History</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ride History</h1>

      {rides.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No rides yet. Book your first ride!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {ride.status.replace("_", " ")}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(ride.requestedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{ride.pickupAddress}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700">{ride.dropoffAddress}</span>
                  </div>
                  {ride.driver && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>
                        {ride.driver.user.name}
                        {ride.driver.vehicle &&
                          ` - ${ride.driver.vehicle.color} ${ride.driver.vehicle.make} ${ride.driver.vehicle.model}`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(ride.actualFare || ride.estimatedFare).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

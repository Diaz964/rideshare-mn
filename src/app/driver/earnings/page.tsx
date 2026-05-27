"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DollarSign, TrendingUp, Car, Calendar } from "lucide-react";
import { format } from "date-fns";

interface EarningsData {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  totalRides: number;
  recentRides: {
    id: string;
    pickupAddress: string;
    dropoffAddress: string;
    actualFare: number;
    completedAt: string;
  }[];
}

export default function DriverEarningsPage() {
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/drivers/earnings");
        const data = await res.json();
        if (data.success) {
          setEarnings(data.data);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-green-50 border border-green-100">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700">Today</p>
              <p className="text-2xl font-bold text-green-900">
                ${earnings?.todayEarnings.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">This Week</p>
              <p className="text-2xl font-bold text-blue-900">
                ${earnings?.weekEarnings.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700">Total Rides</p>
              <p className="text-2xl font-bold text-purple-900">
                {earnings?.totalRides || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All-Time Earnings</h2>
          <p className="text-2xl font-bold text-green-600">
            ${earnings?.totalEarnings.toFixed(2) || "0.00"}
          </p>
        </div>
      </Card>

      <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Recent Rides</h2>
      {earnings?.recentRides && earnings.recentRides.length > 0 ? (
        <div className="space-y-3">
          {earnings.recentRides.map((ride) => (
            <Card key={ride.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{ride.pickupAddress}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {ride.completedAt && format(new Date(ride.completedAt), "MMM d, h:mm a")}
                  </p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  +${(ride.actualFare * 0.75).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-center text-gray-500 py-4">No completed rides yet</p>
        </Card>
      )}
    </div>
  );
}

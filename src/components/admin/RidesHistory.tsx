"use client";

import { useState } from "react";

interface Ride {
  id: string;
  passenger: string;
  driver: string;
  pickup: string;
  destination: string;
  rideType: string;
  fare: number;
  status: "completed" | "in_progress" | "cancelled";
  date: string;
}

const INITIAL_RIDES: Ride[] = [
  {
    id: "r1",
    passenger: "John Doe",
    driver: "Carlos Martinez",
    pickup: "Minneapolis Airport",
    destination: "Downtown Minneapolis",
    rideType: "Comfort",
    fare: 28.5,
    status: "completed",
    date: "2026-06-30 14:30",
  },
  {
    id: "r2",
    passenger: "Jane Smith",
    driver: "Maria Garcia",
    pickup: "Mall of America",
    destination: "St. Paul Capitol",
    rideType: "Standard",
    fare: 18.75,
    status: "in_progress",
    date: "2026-06-30 18:15",
  },
  {
    id: "r3",
    passenger: "Mike Johnson",
    driver: "James Wilson",
    pickup: "U of M Campus",
    destination: "Uptown Minneapolis",
    rideType: "Standard",
    fare: 12.0,
    status: "completed",
    date: "2026-06-30 12:00",
  },
  {
    id: "r4",
    passenger: "Emily Davis",
    driver: "Sofia Rodriguez",
    pickup: "Bloomington Central",
    destination: "Eden Prairie",
    rideType: "XL",
    fare: 32.0,
    status: "cancelled",
    date: "2026-06-30 09:45",
  },
  {
    id: "r5",
    passenger: "Alex Brown",
    driver: "Carlos Martinez",
    pickup: "Target Field",
    destination: "North Loop",
    rideType: "Standard",
    fare: 8.5,
    status: "completed",
    date: "2026-06-29 21:30",
  },
];

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  cancelled: "Cancelled",
};

export default function RidesHistory() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? INITIAL_RIDES
      : INITIAL_RIDES.filter((r) => r.status === filter);

  const totalRevenue = INITIAL_RIDES.filter(
    (r) => r.status === "completed"
  ).reduce((sum, r) => sum + r.fare, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-burgundy-dark mb-6">
        Ride History
      </h1>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["all", "completed", "in_progress", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === s
                  ? "bg-burgundy text-white"
                  : "bg-white text-gray-600 border border-burgundy-100 hover:bg-burgundy-50"
              }`}
            >
              {s === "all"
                ? "All"
                : s === "in_progress"
                  ? "In Progress"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          Total Revenue:{" "}
          <span className="font-bold text-burgundy">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-burgundy-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-burgundy-50 text-sm text-burgundy-dark">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Passenger</th>
              <th className="px-5 py-3 font-semibold">Driver</th>
              <th className="px-5 py-3 font-semibold">Route</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Fare</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-burgundy-50 text-sm">
            {filtered.map((ride) => (
              <tr key={ride.id}>
                <td className="px-5 py-3 text-gray-500">{ride.date}</td>
                <td className="px-5 py-3 text-gray-900 font-medium">
                  {ride.passenger}
                </td>
                <td className="px-5 py-3 text-gray-600">{ride.driver}</td>
                <td className="px-5 py-3 text-gray-600">
                  {ride.pickup} → {ride.destination}
                </td>
                <td className="px-5 py-3 text-gray-600">{ride.rideType}</td>
                <td className="px-5 py-3 font-medium text-burgundy">
                  ${ride.fare.toFixed(2)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[ride.status]}`}
                  >
                    {STATUS_LABELS[ride.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

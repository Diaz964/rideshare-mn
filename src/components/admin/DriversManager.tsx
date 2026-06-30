"use client";

import { useState } from "react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  status: "active" | "inactive" | "on_ride";
  rating: number;
}

const INITIAL_DRIVERS: Driver[] = [
  {
    id: "d1",
    name: "Carlos Martinez",
    phone: "(612) 555-0101",
    vehicle: "2022 Toyota Camry",
    licensePlate: "MN-ABC-123",
    status: "active",
    rating: 4.8,
  },
  {
    id: "d2",
    name: "Maria Garcia",
    phone: "(651) 555-0202",
    vehicle: "2023 Honda Civic",
    licensePlate: "MN-DEF-456",
    status: "on_ride",
    rating: 4.9,
  },
  {
    id: "d3",
    name: "James Wilson",
    phone: "(763) 555-0303",
    vehicle: "2021 Ford Explorer",
    licensePlate: "MN-GHI-789",
    status: "active",
    rating: 4.7,
  },
  {
    id: "d4",
    name: "Sofia Rodriguez",
    phone: "(952) 555-0404",
    vehicle: "2022 Chevrolet Malibu",
    licensePlate: "MN-JKL-012",
    status: "inactive",
    rating: 4.6,
  },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  on_ride: "bg-blue-100 text-blue-700",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  on_ride: "On Ride",
};

export default function DriversManager() {
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [showAdd, setShowAdd] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    vehicle: "",
    licensePlate: "",
  });

  function handleAdd() {
    if (!newDriver.name || !newDriver.phone) return;
    const id = `d${Date.now()}`;
    setDrivers([
      ...drivers,
      {
        ...newDriver,
        id,
        status: "active",
        rating: 5.0,
      },
    ]);
    setNewDriver({ name: "", phone: "", vehicle: "", licensePlate: "" });
    setShowAdd(false);
  }

  function toggleStatus(id: string) {
    setDrivers(
      drivers.map((d) => {
        if (d.id !== id) return d;
        const nextStatus = d.status === "active" ? "inactive" : "active";
        return { ...d, status: nextStatus };
      })
    );
  }

  function handleDelete(id: string) {
    setDrivers(drivers.filter((d) => d.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy-dark">
          Manage Drivers
        </h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors"
        >
          {showAdd ? "Cancel" : "Add Driver"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-burgundy-100 p-6 mb-6">
          <h3 className="font-semibold text-burgundy-dark mb-4">New Driver</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                value={newDriver.name}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                value={newDriver.phone}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <input
                value={newDriver.vehicle}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, vehicle: e.target.value })
                }
                className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Plate
              </label>
              <input
                value={newDriver.licensePlate}
                onChange={(e) =>
                  setNewDriver({ ...newDriver, licensePlate: e.target.value })
                }
                className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newDriver.name || !newDriver.phone}
            className="mt-4 px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors disabled:opacity-40"
          >
            Save Driver
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-xl border border-burgundy-100 p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy font-bold text-sm">
                {driver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{driver.name}</div>
                <div className="text-sm text-gray-500">
                  {driver.vehicle} &middot; {driver.licensePlate}
                </div>
                <div className="text-sm text-gray-400">{driver.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {driver.rating.toFixed(1)} ★
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[driver.status]}`}
              >
                {STATUS_LABELS[driver.status]}
              </span>
              <button
                onClick={() => toggleStatus(driver.id)}
                className="text-xs text-burgundy font-medium hover:underline"
              >
                {driver.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => handleDelete(driver.id)}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

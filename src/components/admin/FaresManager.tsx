"use client";

import { useState } from "react";

interface Fare {
  id: string;
  name: string;
  baseFare: number;
  perMile: number;
  perMinute: number;
  minimumFare: number;
}

const INITIAL_FARES: Fare[] = [
  {
    id: "standard",
    name: "Standard",
    baseFare: 2.5,
    perMile: 1.75,
    perMinute: 0.25,
    minimumFare: 7.0,
  },
  {
    id: "comfort",
    name: "Comfort",
    baseFare: 4.0,
    perMile: 2.5,
    perMinute: 0.35,
    minimumFare: 10.0,
  },
  {
    id: "xl",
    name: "XL",
    baseFare: 5.0,
    perMile: 3.0,
    perMinute: 0.45,
    minimumFare: 14.0,
  },
];

export default function FaresManager() {
  const [fares, setFares] = useState<Fare[]>(INITIAL_FARES);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Fare | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newFare, setNewFare] = useState<Fare>({
    id: "",
    name: "",
    baseFare: 0,
    perMile: 0,
    perMinute: 0,
    minimumFare: 0,
  });

  function handleEdit(fare: Fare) {
    setEditing(fare.id);
    setEditData({ ...fare });
  }

  function handleSave() {
    if (!editData) return;
    setFares(fares.map((f) => (f.id === editData.id ? editData : f)));
    setEditing(null);
    setEditData(null);
  }

  function handleDelete(id: string) {
    setFares(fares.filter((f) => f.id !== id));
  }

  function handleAdd() {
    if (!newFare.name) return;
    const id = newFare.name.toLowerCase().replace(/\s+/g, "-");
    setFares([...fares, { ...newFare, id }]);
    setNewFare({
      id: "",
      name: "",
      baseFare: 0,
      perMile: 0,
      perMinute: 0,
      minimumFare: 0,
    });
    setShowAdd(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy-dark">Manage Fares</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors"
        >
          {showAdd ? "Cancel" : "Add Fare"}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl border border-burgundy-100 p-6 mb-6">
          <h3 className="font-semibold text-burgundy-dark mb-4">
            New Fare Type
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Name"
              value={newFare.name}
              onChange={(v) => setNewFare({ ...newFare, name: v })}
            />
            <NumberInput
              label="Base Fare ($)"
              value={newFare.baseFare}
              onChange={(v) => setNewFare({ ...newFare, baseFare: v })}
            />
            <NumberInput
              label="Per Mile ($)"
              value={newFare.perMile}
              onChange={(v) => setNewFare({ ...newFare, perMile: v })}
            />
            <NumberInput
              label="Per Minute ($)"
              value={newFare.perMinute}
              onChange={(v) => setNewFare({ ...newFare, perMinute: v })}
            />
            <NumberInput
              label="Minimum Fare ($)"
              value={newFare.minimumFare}
              onChange={(v) => setNewFare({ ...newFare, minimumFare: v })}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newFare.name}
            className="mt-4 px-4 py-2 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy-dark transition-colors disabled:opacity-40"
          >
            Save Fare
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-burgundy-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-burgundy-50 text-sm text-burgundy-dark">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Base Fare</th>
              <th className="px-6 py-3 font-semibold">Per Mile</th>
              <th className="px-6 py-3 font-semibold">Per Min</th>
              <th className="px-6 py-3 font-semibold">Minimum</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-burgundy-50">
            {fares.map((fare) =>
              editing === fare.id && editData ? (
                <tr key={fare.id} className="bg-burgundy-50/50">
                  <td className="px-6 py-3">
                    <input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.baseFare}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          baseFare: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 border border-burgundy-200 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.perMile}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          perMile: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 border border-burgundy-200 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.perMinute}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          perMinute: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 border border-burgundy-200 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={editData.minimumFare}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          minimumFare: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 border border-burgundy-200 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={handleSave}
                      className="text-sm text-green-600 font-medium mr-3 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(null);
                        setEditData(null);
                      }}
                      className="text-sm text-gray-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={fare.id}>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {fare.name}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    ${fare.baseFare.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    ${fare.perMile.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    ${fare.perMinute.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    ${fare.minimumFare.toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleEdit(fare)}
                      className="text-sm text-burgundy font-medium mr-3 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(fare.id)}
                      className="text-sm text-red-500 font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy"
      />
    </div>
  );
}

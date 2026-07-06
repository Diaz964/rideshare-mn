"use client";

import { useState, useEffect } from "react";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  driversLicense: string;
  licenseState: string;
  licenseExpiry: string;
  carMake: string;
  carModel: string;
  carYear: string;
  carColor: string;
  licensePlate: string;
  insurance: string;
  insuranceExpiry: string;
  experience: string;
  availability: string;
  about: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("xelaju_applications");
    if (stored) setApplications(JSON.parse(stored));
  }, []);

  function updateStatus(id: string, status: "approved" | "rejected") {
    const updated = applications.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    setApplications(updated);
    localStorage.setItem("xelaju_applications", JSON.stringify(updated));

    if (status === "approved") {
      const app = updated.find((a) => a.id === id);
      if (app) {
        const drivers = JSON.parse(
          localStorage.getItem("xelaju_drivers") || "[]"
        );
        drivers.push({
          id: `d${Date.now()}`,
          name: `${app.firstName} ${app.lastName}`,
          phone: app.phone,
          vehicle: `${app.carYear} ${app.carMake} ${app.carModel}`,
          vehicleColor: app.carColor,
          licensePlate: app.licensePlate,
          status: "active",
          rating: 5.0,
        });
        localStorage.setItem("xelaju_drivers", JSON.stringify(drivers));
      }
    }
  }

  function removeApplication(id: string) {
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    localStorage.setItem("xelaju_applications", JSON.stringify(updated));
  }

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-burgundy-dark">
          Driver Applications
        </h1>
        {pending.length > 0 && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
            {pending.length} pending
          </span>
        )}
      </div>

      {applications.length === 0 && (
        <div className="bg-white rounded-xl border border-burgundy-100 p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500">No applications yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Share the driver application link:{" "}
            <span className="font-mono text-burgundy">
              transportesxelaju.com/drive
            </span>
          </p>
        </div>
      )}

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-burgundy-dark mb-4">
            Pending Review ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                expanded={expanded === app.id}
                onToggle={() =>
                  setExpanded(expanded === app.id ? null : app.id)
                }
                onApprove={() => updateStatus(app.id, "approved")}
                onReject={() => updateStatus(app.id, "rejected")}
                onRemove={() => removeApplication(app.id)}
              />
            ))}
          </div>
        </section>
      )}

      {reviewed.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-burgundy-dark mb-4">
            Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-4">
            {reviewed.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                expanded={expanded === app.id}
                onToggle={() =>
                  setExpanded(expanded === app.id ? null : app.id)
                }
                onRemove={() => removeApplication(app.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ApplicationCard({
  app,
  expanded,
  onToggle,
  onApprove,
  onReject,
  onRemove,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-burgundy-100 overflow-hidden">
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-burgundy-50/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy font-bold text-sm">
            {app.firstName[0]}
            {app.lastName[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {app.firstName} {app.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {app.carYear} {app.carMake} {app.carModel} ({app.carColor}) &middot;{" "}
              {app.phone}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status]}`}
          >
            {app.status}
          </span>
          <span className="text-gray-400 text-sm">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-burgundy-100 p-5 bg-burgundy-50/30">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <Detail label="Email" value={app.email} />
            <Detail label="Phone" value={app.phone} />
            <Detail
              label="Address"
              value={
                [app.address, app.city, app.state, app.zip]
                  .filter(Boolean)
                  .join(", ") || "—"
              }
            />
            <Detail label="License #" value={app.driversLicense} />
            <Detail label="License State" value={app.licenseState} />
            <Detail label="License Expires" value={app.licenseExpiry} />
            <Detail
              label="Vehicle"
              value={`${app.carYear} ${app.carMake} ${app.carModel}`}
            />
            <Detail label="Color" value={app.carColor} />
            <Detail label="Plate" value={app.licensePlate} />
            <Detail label="Insurance" value={app.insurance} />
            <Detail label="Insurance Expires" value={app.insuranceExpiry} />
            <Detail label="Experience" value={app.experience || "—"} />
            <Detail label="Availability" value={app.availability || "—"} />
            <Detail
              label="Submitted"
              value={new Date(app.submittedAt).toLocaleDateString()}
            />
          </div>
          {app.about && (
            <div className="mt-3 pt-3 border-t border-burgundy-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">About:</span>{" "}
                {app.about}
              </p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-burgundy-100 flex gap-3">
            {app.status === "pending" && onApprove && onReject && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove();
                  }}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve & Add to Fleet
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject();
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="px-4 py-2 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-gray-700">{label}:</span>{" "}
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

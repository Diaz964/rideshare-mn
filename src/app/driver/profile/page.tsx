"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { User, Mail, Phone, Car, Star, Shield } from "lucide-react";

interface DriverProfile {
  id: string;
  licenseNumber: string;
  rating: number;
  totalRides: number;
  totalEarnings: number;
  isVerified: boolean;
  user: {
    name: string;
    email: string;
    phone: string | null;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  } | null;
}

export default function DriverProfilePage() {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/drivers");
        const data = await res.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Driver Profile</h1>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Driver Profile</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profile.user.name}</h2>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">{profile.rating.toFixed(1)} rating</span>
              <span className="text-sm text-gray-400">&bull;</span>
              <span className="text-sm text-gray-600">{profile.totalRides} rides</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{profile.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{profile.user.phone || "Not set"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Verification Status</p>
              <p className={`text-sm font-medium ${profile.isVerified ? "text-green-600" : "text-yellow-600"}`}>
                {profile.isVerified ? "Verified" : "Pending Verification"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {profile.vehicle && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Car className="h-5 w-5 text-purple-600" />
            Vehicle Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Make</p>
              <p className="text-sm font-medium">{profile.vehicle.make}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Model</p>
              <p className="text-sm font-medium">{profile.vehicle.model}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="text-sm font-medium">{profile.vehicle.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Color</p>
              <p className="text-sm font-medium">{profile.vehicle.color}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">License Plate</p>
              <p className="text-sm font-medium">{profile.vehicle.licensePlate}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

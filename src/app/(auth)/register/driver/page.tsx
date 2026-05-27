"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { Car } from "lucide-react";

export default function DriverRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: new Date().getFullYear(),
    vehicleColor: "",
    licensePlate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Registration failed");
        return;
      }

      setUser(data.data);
      toast.success("Driver account created! Welcome aboard!");
      router.push("/driver/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Car className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Become a Driver</h1>
          <p className="text-gray-600 mt-2">
            Earn money on your schedule in Minnesota
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="name"
              name="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              placeholder="(612) 555-0123"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 pt-4">
            Driver License
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="licenseNumber"
              name="licenseNumber"
              label="License Number"
              placeholder="MN-12345678"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
            <Input
              id="licenseExpiry"
              name="licenseExpiry"
              label="License Expiry"
              type="date"
              value={formData.licenseExpiry}
              onChange={handleChange}
              required
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 pt-4">
            Vehicle Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="vehicleMake"
              name="vehicleMake"
              label="Make"
              placeholder="Toyota"
              value={formData.vehicleMake}
              onChange={handleChange}
              required
            />
            <Input
              id="vehicleModel"
              name="vehicleModel"
              label="Model"
              placeholder="Camry"
              value={formData.vehicleModel}
              onChange={handleChange}
              required
            />
            <Input
              id="vehicleYear"
              name="vehicleYear"
              label="Year"
              type="number"
              min={1990}
              max={2027}
              value={formData.vehicleYear}
              onChange={handleChange}
              required
            />
            <Input
              id="vehicleColor"
              name="vehicleColor"
              label="Color"
              placeholder="Silver"
              value={formData.vehicleColor}
              onChange={handleChange}
              required
            />
            <Input
              id="licensePlate"
              name="licensePlate"
              label="License Plate"
              placeholder="ABC 1234"
              value={formData.licensePlate}
              onChange={handleChange}
              required
              className="md:col-span-2"
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Apply to Drive
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

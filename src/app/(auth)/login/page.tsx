"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { Car } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || "Login failed");
        return;
      }

      setUser(data.data);
      toast.success("Welcome back!");

      if (data.data.role === "DRIVER") {
        router.push("/driver/dashboard");
      } else {
        router.push("/passenger/ride");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Car className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your RideShare MN account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-purple-600 font-medium hover:underline">
            Sign up as Passenger
          </Link>{" "}
          or{" "}
          <Link href="/register/driver" className="text-purple-600 font-medium hover:underline">
            Apply to Drive
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Car, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">
                RideShare MN
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-6">
              {user.role === "PASSENGER" && (
                <>
                  <Link
                    href="/passenger/ride"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Book Ride
                  </Link>
                  <Link
                    href="/passenger/history"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    History
                  </Link>
                  <Link
                    href="/passenger/profile"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Profile
                  </Link>
                </>
              )}
              {user.role === "DRIVER" && (
                <>
                  <Link
                    href="/driver/dashboard"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/driver/rides"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Rides
                  </Link>
                  <Link
                    href="/driver/earnings"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Earnings
                  </Link>
                  <Link
                    href="/driver/profile"
                    className="text-gray-700 hover:text-purple-600 font-medium"
                  >
                    Profile
                  </Link>
                </>
              )}
              <div className="flex items-center gap-2 ml-4">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-500"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && user && (
        <div className="md:hidden border-t border-gray-200 bg-white pb-3 pt-2">
          <div className="space-y-1 px-4">
            {user.role === "PASSENGER" && (
              <>
                <Link href="/passenger/ride" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Book Ride
                </Link>
                <Link href="/passenger/history" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  History
                </Link>
                <Link href="/passenger/profile" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </>
            )}
            {user.role === "DRIVER" && (
              <>
                <Link href="/driver/dashboard" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/driver/rides" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Rides
                </Link>
                <Link href="/driver/earnings" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Earnings
                </Link>
                <Link href="/driver/profile" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </>
            )}
            <button onClick={handleLogout} className="block py-2 text-red-600 w-full text-left">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

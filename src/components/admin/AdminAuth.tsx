"use client";

import { useState, useEffect } from "react";

const ADMIN_PASSWORD_HASH = "TWVuY2hvOTY0";

export default function AdminAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem("xelaju_admin_auth");
    if (session === ADMIN_PASSWORD_HASH) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (btoa(password) === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem("xelaju_admin_auth", ADMIN_PASSWORD_HASH);
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-burgundy-50">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-burgundy-50 px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-sm border border-burgundy-100 p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔒</div>
              <h1 className="text-2xl font-bold text-burgundy-dark">
                Admin Login
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your password to continue
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 rounded-xl border border-burgundy-200 focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent text-gray-900 placeholder-gray-400"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">
                    Incorrect password. Try again.
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-burgundy text-white font-semibold hover:bg-burgundy-dark transition-colors shadow-lg"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

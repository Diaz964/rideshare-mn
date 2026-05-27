"use client";

import { create } from "zustand";
import type { Location, FareBreakdown } from "@/types";

interface RideState {
  pickup: Location | null;
  dropoff: Location | null;
  fareEstimate: FareBreakdown | null;
  currentRideId: string | null;
  rideStatus: string | null;
  driverLocation: { lat: number; lng: number } | null;

  setPickup: (location: Location | null) => void;
  setDropoff: (location: Location | null) => void;
  setFareEstimate: (fare: FareBreakdown | null) => void;
  setCurrentRide: (rideId: string | null, status: string | null) => void;
  setDriverLocation: (location: { lat: number; lng: number } | null) => void;
  reset: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  pickup: null,
  dropoff: null,
  fareEstimate: null,
  currentRideId: null,
  rideStatus: null,
  driverLocation: null,

  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  setFareEstimate: (fare) => set({ fareEstimate: fare }),
  setCurrentRide: (rideId, status) =>
    set({ currentRideId: rideId, rideStatus: status }),
  setDriverLocation: (location) => set({ driverLocation: location }),
  reset: () =>
    set({
      pickup: null,
      dropoff: null,
      fareEstimate: null,
      currentRideId: null,
      rideStatus: null,
      driverLocation: null,
    }),
}));

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RideRequest {
  pickup: Location;
  dropoff: Location;
  estimatedFare: number;
  estimatedDuration: number;
  estimatedDistance: number;
}

export interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  heading: number;
  updatedAt: Date;
}

export interface FareBreakdown {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  bookingFee: number;
  surgeMultiplier: number;
  totalFare: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

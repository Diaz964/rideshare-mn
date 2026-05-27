const BASE_FARE = 2.5;
const PER_MILE_RATE = 1.75;
const PER_MINUTE_RATE = 0.35;
const BOOKING_FEE = 1.5;
const MINIMUM_FARE = 5.0;
const SURGE_MULTIPLIER_THRESHOLD = 0.8;

export interface FareEstimate {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  bookingFee: number;
  surgeMultiplier: number;
  totalFare: number;
}

export function calculateFare(
  distanceMiles: number,
  durationMinutes: number,
  demandRatio: number = 0.5
): FareEstimate {
  const surgeMultiplier =
    demandRatio > SURGE_MULTIPLIER_THRESHOLD
      ? 1 + (demandRatio - SURGE_MULTIPLIER_THRESHOLD) * 2
      : 1;

  const baseFare = BASE_FARE;
  const distanceFare = distanceMiles * PER_MILE_RATE;
  const timeFare = durationMinutes * PER_MINUTE_RATE;
  const bookingFee = BOOKING_FEE;

  const subtotal = (baseFare + distanceFare + timeFare) * surgeMultiplier + bookingFee;
  const totalFare = Math.max(subtotal, MINIMUM_FARE);

  return {
    baseFare,
    distanceFare: Math.round(distanceFare * 100) / 100,
    timeFare: Math.round(timeFare * 100) / 100,
    bookingFee,
    surgeMultiplier: Math.round(surgeMultiplier * 100) / 100,
    totalFare: Math.round(totalFare * 100) / 100,
  };
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function estimateDuration(distanceMiles: number): number {
  const avgSpeedMph = 25;
  return Math.round((distanceMiles / avgSpeedMph) * 60);
}

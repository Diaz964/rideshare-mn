export interface Fare {
  id: string;
  name: string;
  baseFare: number;
  perMile: number;
  perMinute: number;
  minimumFare: number;
}

export const DEFAULT_FARES: Fare[] = [
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

// Public, already client-exposed admin hash (matches AdminAuth).
export const ADMIN_AUTH = "TWVuY2hvOTY0";

export async function fetchFares(): Promise<Fare[]> {
  try {
    const res = await fetch("/api/fares.php", { cache: "no-store" });
    const data = await res.json();
    if (data?.success && Array.isArray(data.fares) && data.fares.length > 0) {
      return data.fares as Fare[];
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_FARES;
}

export async function saveFares(fares: Fare[]): Promise<boolean> {
  try {
    const res = await fetch("/api/fares.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth: ADMIN_AUTH, fares }),
    });
    const data = await res.json();
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

export function computeFarePrice(
  fare: Fare,
  miles: number,
  minutes: number
): number {
  const price =
    fare.baseFare + miles * fare.perMile + minutes * fare.perMinute;
  return Math.max(price, fare.minimumFare);
}

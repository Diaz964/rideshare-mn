"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  pickup?: { lat: number; lng: number } | null;
  dropoff?: { lat: number; lng: number } | null;
  driverLocation?: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
}

const MINNESOTA_CENTER: [number, number] = [44.9778, -93.265];

export function MapView({
  center = MINNESOTA_CENTER,
  zoom = 13,
  pickup,
  dropoff,
  driverLocation,
  onMapClick,
  className = "",
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    if (onMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (pickup) {
      const pickupIcon = L.divIcon({
        className: "custom-marker",
        html: '<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>',
        iconSize: [16, 16],
      });
      const marker = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
        .addTo(mapRef.current)
        .bindPopup("Pickup Location");
      markersRef.current.push(marker);
    }

    if (dropoff) {
      const dropoffIcon = L.divIcon({
        className: "custom-marker",
        html: '<div class="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>',
        iconSize: [16, 16],
      });
      const marker = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
        .addTo(mapRef.current)
        .bindPopup("Dropoff Location");
      markersRef.current.push(marker);
    }

    if (driverLocation) {
      const driverIcon = L.divIcon({
        className: "custom-marker",
        html: '<div class="w-5 h-5 bg-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center"><svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/></svg></div>',
        iconSize: [20, 20],
      });
      const marker = L.marker([driverLocation.lat, driverLocation.lng], {
        icon: driverIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("Driver");
      markersRef.current.push(marker);
    }

    if (pickup && dropoff) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, dropoff, driverLocation, isMapReady]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full min-h-[300px] rounded-xl ${className}`}
    />
  );
}

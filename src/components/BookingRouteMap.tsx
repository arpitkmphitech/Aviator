"use client";

import type { LatLng, RoutePoint } from "@/types/booking";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";
import { START_POINT, END_POINT, STOP_POINT } from "@/lib/images";

function toLatLng(point: LatLng | RoutePoint): { lat: number; lng: number } {
  const p = point as { lat: number; lng?: number; long?: number };
  return { lat: p.lat, lng: p.lng ?? p.long ?? 0 };
}

function getMarkerIcon(
  index: number,
  total: number,
  activityType?: string
): string {
  const normalizedType = activityType?.toLowerCase();
  const isSightseeing = normalizedType === "sightseeing";

  if (isSightseeing) {
    if (index === 0) return START_POINT;
    if (index === 1 && total >= 2) return END_POINT;
    return STOP_POINT;
  }

  if (index === 0) return START_POINT;
  if (index === 1 && total >= 2) return END_POINT;
  return STOP_POINT;
}

type BookingRouteMapProps = {
  routeCoordinates: (LatLng | RoutePoint)[];
  className?: string;
  activityType?: string;
};

export function BookingRouteMap({
  routeCoordinates,
  className,
  activityType,
}: BookingRouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(
    null
  );

  const normalizedPoints = useMemo(() => {
    if (!routeCoordinates?.length) return [];
    return routeCoordinates.map((p) => ({
      ...toLatLng(p),
      mainLocation:
        "mainLocation" in p && typeof p.mainLocation === "string"
          ? p.mainLocation
          : undefined,
      location:
        "location" in p && typeof p.location === "string"
          ? p.location
          : undefined,
    }));
  }, [routeCoordinates]);

  const pathForPolyline = useMemo(() => {
    if (!normalizedPoints.length) return [];

    const basePath = normalizedPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const normalizedType = activityType?.toLowerCase();
    const isSightseeing = normalizedType === "sightseeing";

    if (isSightseeing && normalizedPoints.length >= 2) {
      return [
        ...basePath,
        { lat: normalizedPoints[0].lat, lng: normalizedPoints[0].lng },
      ];
    }

    return basePath;
  }, [normalizedPoints, activityType]);

  const bounds = useMemo(() => {
    if (normalizedPoints.length < 2) return null;
    const lats = normalizedPoints.map((p) => p.lat);
    const lngs = normalizedPoints.map((p) => p.lng);
    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  }, [normalizedPoints]);

  const onMapLoad = useCallback(
    (map: google.maps.Map) => {
      if (
        bounds &&
        bounds.north !== bounds.south &&
        bounds.east !== bounds.west
      ) {
        try {
          map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
        } catch {}
      }
    },
    [bounds]
  );

  if (!apiKey)
    return (
      <div className="h-[320px] flex flex-col items-center justify-center bg-gray-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-medium">
          Google Maps API key is missing.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.
        </p>
      </div>
    );
  if (loadError)
    return (
      <div className="h-[320px] flex flex-col items-center justify-center bg-gray-200 rounded-xl p-4 text-center">
        <p className="text-red-600 font-medium">Error loading Google Maps.</p>
        <p className="text-sm text-gray-600 mt-2">
          Check the browser console. Ensure Maps JavaScript API is enabled and
          your API key is valid.
        </p>
      </div>
    );
  if (!isLoaded)
    return (
      <div className="h-[320px] flex items-center justify-center bg-gray-200 rounded-xl">
        Loading map...
      </div>
    );

  if (!normalizedPoints.length) {
    return (
      <div className="h-[320px] flex items-center justify-center bg-gray-200 rounded-xl">
        No route coordinates
      </div>
    );
  }

  const center = normalizedPoints[0];

  const mapOptions = {
    fullscreenControl: true,
    disableDefaultUI: true,
  };

  return (
    <div className={`h-[445px] rounded-xl overflow-hidden ${className ?? ""}`}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={6}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        <Polyline
          path={pathForPolyline}
          options={{
            strokeColor: "#8D5BEB",
            strokeOpacity: 1,
            strokeWeight: 4,
          }}
        />

        {normalizedPoints.map((point, index) => (
          <Marker
            key={index}
            position={{ lat: point.lat, lng: point.lng }}
            icon={{
              url: `${
                typeof window !== "undefined" ? window.location.origin : ""
              }${getMarkerIcon(index, normalizedPoints.length, activityType)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
            onClick={() => setActiveMarkerIndex(index)}
          />
        ))}

        {activeMarkerIndex !== null &&
          normalizedPoints[activeMarkerIndex] &&
          normalizedPoints[activeMarkerIndex].location && (
            <InfoWindow
              position={{
                lat: normalizedPoints[activeMarkerIndex].lat,
                lng: normalizedPoints[activeMarkerIndex].lng,
              }}
              onCloseClick={() => setActiveMarkerIndex(null)}
            >
              <div className="text-sm text-[#1F1F1F] max-w-[220px]">
                {normalizedPoints[activeMarkerIndex].location}
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </div>
  );
}

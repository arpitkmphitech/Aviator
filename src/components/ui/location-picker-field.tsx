"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  loadGoogleMapsPlaces,
  type PlacePredictionGoogle,
} from "@/lib/google-maps-places";
import { MapPin } from "lucide-react";

export type PickedLocation = {
  display: string;
  lat: number;
  lng: number;
  city?: string;
};

type LocationPickerFieldProps = {
  value: string;
  onSelect: (location: PickedLocation) => void;
  placeholder?: string;
  className?: string;
  countryRestriction?: string[];
  apiKey: string;
};

export function LocationPickerField({
  value,
  onSelect,
  placeholder = "Search location or click on map",
  className,
  countryRestriction,
  apiKey,
}: LocationPickerFieldProps) {
  const [inputValue, setInputValue] = useState(value);
  const [predictions, setPredictions] = useState<PlacePredictionGoogle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<{
    getPlacePredictions: (
      req: { input: string; componentRestrictions?: { country: string[] } },
      cb: (r: PlacePredictionGoogle[] | null, s: string) => void
    ) => void;
  } | null>(null);
  const placesServiceRef = useRef<{
    getDetails: (
      req: { placeId: string; fields: string[] },
      cb: (place: unknown, status: string) => void
    ) => void;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (!apiKey) return;
    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (typeof window !== "undefined" && window.google?.maps?.places) {
          autocompleteRef.current =
            new window.google.maps.places.AutocompleteService() as typeof autocompleteRef.current;
          const div = document.createElement("div");
          placesServiceRef.current =
            new window.google.maps.places.PlacesService(
              div
            ) as typeof placesServiceRef.current;
        }
        setScriptsReady(true);
      })
      .catch((err) => console.error("Google Maps Places load error:", err));
  }, [apiKey]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!autocompleteRef.current || !input.trim()) {
        setPredictions([]);
        setIsOpen(false);
        return;
      }
      setIsLoading(true);
      const request: {
        input: string;
        componentRestrictions?: { country: string[] };
      } = { input };
      if (countryRestriction?.length) {
        request.componentRestrictions = { country: countryRestriction };
      }
      autocompleteRef.current.getPlacePredictions(
        request,
        (results, status) => {
          setIsLoading(false);
          if (status === "OK" && results) {
            setPredictions(results);
            setIsOpen(true);
          } else {
            setPredictions([]);
            setIsOpen(false);
          }
        }
      );
    },
    [countryRestriction]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(v), 300);
  };

  const handlePredictionClick = (prediction: PlacePredictionGoogle) => {
    if (!placesServiceRef.current) return;
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["formatted_address", "geometry", "name", "address_components"],
      },
      (place: unknown, status: string) => {
        const p = place as {
          geometry?: {
            location:
              | { lat: () => number; lng: () => number }
              | { lat: number; lng: number };
          };
          formatted_address?: string;
          address_components?: {
            long_name: string;
            short_name: string;
            types: string[];
          }[];
        };
        if (status === "OK" && p?.geometry?.location) {
          const loc = p.geometry.location;
          const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
          const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
          const display = p.formatted_address || prediction.description || "";

          const cityComponent = p.address_components?.find(
            (c) =>
              c.types.includes("locality") ||
              c.types.includes("postal_town") ||
              c.types.includes("administrative_area_level_1")
          );
          const city = cityComponent?.long_name;

          setInputValue(display);
          setPredictions([]);
          setIsOpen(false);
          onSelect({ display, lat, lng, city });
        }
      }
    );
  };

  if (!apiKey) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-primary shrink-0 pointer-events-none z-10" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "w-full pl-10 pr-4 py-6 rounded-[12px] border border-[#ECECED] bg-[#F6F6F7] text-[#374151] placeholder:text-[#9CA3AF]",
            "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
            "disabled:opacity-50",
            className
          )}
          disabled={!scriptsReady}
        />
      </div>
      {isOpen && predictions.length > 0 && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-white rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden",
            "max-h-[280px] overflow-y-auto"
          )}
        >
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[#6B7280]">
              Loading...
            </div>
          ) : (
            predictions.map((p) => (
              <button
                key={p.place_id}
                type="button"
                onClick={() => handlePredictionClick(p)}
                className="w-full text-left px-4 py-3 hover:bg-[#F5F5F5] focus:bg-[#F5F5F5] transition-colors border-b border-[#F0F0F0] last:border-b-0"
              >
                <div className="font-medium text-[#111827] text-sm">
                  {p.structured_formatting.main_text}
                </div>
                {p.structured_formatting.secondary_text && (
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    {p.structured_formatting.secondary_text}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

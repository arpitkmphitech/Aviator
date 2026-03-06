"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadGoogleMapsPlaces,
  type PlacePredictionGoogle,
} from "@/lib/google-maps-places";
import type { ILocationPickerField } from "@/types/form";

export type PickedLocation = {
  display: string;
  lat: number;
  lng: number;
};

export type LocationPickerValue = PickedLocation | null;

type LocationPickerProps = ILocationPickerField & {
  apiKey?: string;
};

const LocationPicker = ({
  name,
  placeholder = "Search location",
  label,
  className,
  prefix = null,
  countryRestriction,
  apiKey,
}: LocationPickerProps) => {
  const { control } = useFormContext();
  const watchedValue = useWatch({ control, name });
  const [inputValue, setInputValue] = useState("");
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

  const key = apiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  useEffect(() => {
    const d =
      typeof watchedValue === "object" && watchedValue?.display
        ? (watchedValue as { display: string }).display
        : (watchedValue ?? "");
    if (d) setInputValue(String(d));
  }, [watchedValue]);

  useEffect(() => {
    if (!key) return;
    loadGoogleMapsPlaces(key)
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
  }, [key]);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: LocationPickerValue) => void
  ) => {
    const v = e.target.value;
    setInputValue(v);
    onChange(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(v), 300);
  };

  const handlePredictionClick = (
    prediction: PlacePredictionGoogle,
    onChange: (value: LocationPickerValue) => void
  ) => {
    if (!placesServiceRef.current) return;
    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["formatted_address", "geometry", "name"],
      },
      (place: unknown, status: string) => {
        const p = place as {
          geometry?: {
            location:
              | { lat: () => number; lng: () => number }
              | { lat: number; lng: number };
          };
          formatted_address?: string;
        };
        if (status === "OK" && p?.geometry?.location) {
          const loc = p.geometry.location;
          const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
          const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
          const display = p.formatted_address || prediction.description || "";
          setInputValue(display);
          setPredictions([]);
          setIsOpen(false);
          onChange({ display, lat, lng });
        }
      }
    );
  };

  if (!key) return null;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name);
        const displayFromField =
          typeof field.value === "object" && field.value?.display
            ? field.value.display
            : (field.value ?? "");
        const showValue = inputValue || displayFromField;

        return (
          <div className="space-y-1.5 sm:space-y-2.5">
            {label && (
              <label className="text-primary font-semibold text-sm">
                {label}
              </label>
            )}
            <div className="space-y-1 min-w-0">
              <FormItem className="relative min-w-0">
                <div className="relative w-full" ref={containerRef}>
                  <FormControl>
                    <div className="relative">
                      {prefix && (
                        <div
                          className={cn(
                            "absolute flex items-center top-[13.5px] sm:top-[18px] left-[16px] sm:left-[20px] z-10"
                          )}
                        >
                          {prefix}
                        </div>
                      )}
                      <Input
                        type="text"
                        value={showValue}
                        onChange={(e) => handleInputChange(e, field.onChange)}
                        onFocus={() =>
                          predictions.length > 0 && setIsOpen(true)
                        }
                        placeholder={placeholder}
                        autoComplete="off"
                        disabled={!scriptsReady}
                        required
                        id={name}
                        className={cn(
                          "placeholder:text-secondary bg-[#F6F6F7]! border border-border hover:border-main placeholder:font-normal focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:border-main text-primary text-base md:text-lg placeholder:text-base sm:placeholder:text-lg h-[52px] sm:h-[58px] px-6 rounded-[12px] font-normal transition-colors min-w-0",
                          fieldError?.message
                            ? "text-red-500 focus-visible:ring-red-500 border-red-500 hover:border-red-500"
                            : "text-black disabled:text-[#969696f2] focus-visible:ring-main",
                          prefix ? "pl-[50px] sm:pl-[55px]" : "",
                          className
                        )}
                      />
                    </div>
                  </FormControl>
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
                            onClick={() =>
                              handlePredictionClick(p, field.onChange)
                            }
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
              </FormItem>
              {fieldError?.message && (
                <div className="pt-1 pl-3 text-xs sm:text-sm font-normal text-red-500">
                  {fieldError?.message as string}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default LocationPicker;

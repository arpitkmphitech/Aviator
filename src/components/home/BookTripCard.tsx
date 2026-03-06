"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { MapPin, Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LocationPickerModal,
  type PickedLocation,
} from "@/components/modals/LocationPickerModal";
import {
  AIRCRAFT_ICON,
  CALENDAR_ICON,
  FLIGHT_DURATION_ICON,
  FROM_ICON,
  TO_ICON,
} from "@/lib/images";
import ImageCustom from "../common/Image";
import { useTranslation } from "react-i18next";
import type { TourType } from "@/types/home";
import useGotSortFlights from "@/hooks/home/useGotSortFlights";
import { useAuthStore } from "@/store/useAuthStore";

const TRIP_TYPES = [
  { value: "sightseeing", label: "sightseeing" },
  { value: "excursion", label: "excursion" },
  { value: "oneWay", label: "oneWay" },
] as const;

const AIRCRAFT_OPTIONS = [
  { value: "plane", label: "Plane" },
  { value: "helicopter", label: "Helicopter" },
];
export interface SearchFlightsParams {
  tourType: TourType;
  from?: { lat: number; lng: number }[] | string[];
  to?: { lat: number; lng: number }[] | string[];
  departureDate?: string;
  craftType?: string;
  flightDuration?: string;
  passengers?: number;
  priceMin?: number;
  priceMax?: number;
}

interface BookTripCardProps {
  onSearch?: (params: SearchFlightsParams) => void;
  onTourTypeChange?: (params: SearchFlightsParams) => void;
}

type LocationEditing =
  | { type: "sightseeing-from" }
  | { type: "oneway-from" }
  | { type: "oneway-to" }
  | { type: "excursion-from"; index: number };

export function BookTripCard({
  onSearch,
  onTourTypeChange,
}: BookTripCardProps) {
  const { t } = useTranslation("wishlist");
  const [tripType, setTripType] = useState("sightseeing");
  const [passengers, setPassengers] = useState(1);
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const { token } = useAuthStore();

  const { sortFlightList } = useGotSortFlights(!!token);

  const [sightseeingFrom, setSightseeingFrom] = useState<PickedLocation | null>(
    null
  );
  const DURATION_OPTIONS = [
    {
      value: "short",
      label: `Short Flights (<60m) (${sortFlightList?.shortFlight ?? 0})`,
    },
    {
      value: "classic",
      label: `Classic Flights (1h - 1h 15m) (${sortFlightList?.classicFlight ?? 0})`,
    },
    {
      value: "extended",
      label: `Extended Flights (1h 16m - 2h) (${sortFlightList?.extendedFlights ?? 0})`,
    },
    {
      value: "long",
      label: `Long Adventures (2h+) (${sortFlightList?.longFlights ?? 0})`,
    },
  ];

  const [onewayFrom, setOnewayFrom] = useState<PickedLocation | null>(null);
  const [onewayTo, setOnewayTo] = useState<PickedLocation | null>(null);

  const [excursionFroms, setExcursionFroms] = useState<
    (PickedLocation | null)[]
  >([null]);

  const [aircraft, setAircraft] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<LocationEditing | null>(null);

  const openLocationPicker = (edit: LocationEditing) => {
    setEditingLocation(edit);
    setLocationModalOpen(true);
  };

  const getInitialLocationForEdit = (): PickedLocation | null => {
    if (!editingLocation) return null;
    switch (editingLocation.type) {
      case "sightseeing-from":
        return sightseeingFrom;
      case "oneway-from":
        return onewayFrom;
      case "oneway-to":
        return onewayTo;
      case "excursion-from": {
        const loc = excursionFroms[editingLocation.index];
        return loc ?? null;
      }
      default:
        return null;
    }
  };

  const handleLocationSave = (location: PickedLocation) => {
    if (!editingLocation) return;
    switch (editingLocation.type) {
      case "sightseeing-from":
        setSightseeingFrom(location);
        break;
      case "oneway-from":
        setOnewayFrom(location);
        break;
      case "oneway-to":
        setOnewayTo(location);
        break;
      case "excursion-from": {
        setExcursionFroms((prev) => {
          const next = [...prev];
          while (next.length <= editingLocation.index) next.push(null);
          next[editingLocation.index] = location;
          return next;
        });
        break;
      }
    }
    setEditingLocation(null);
    setLocationModalOpen(false);
  };

  const handleLocationClose = () => {
    setLocationModalOpen(false);
    setEditingLocation(null);
  };

  const addExcursionFrom = () => setExcursionFroms((s) => [...s, null]);
  const removeExcursionFrom = (index: number) => {
    if (excursionFroms.length <= 1) return;
    setExcursionFroms((s) => s.filter((_, i) => i !== index));
  };

  const buildSearchParams = (
    overrideTripType?: string
  ): SearchFlightsParams => {
    const effectiveType = (overrideTripType ?? tripType) as TourType;
    const params: SearchFlightsParams = {
      tourType: effectiveType,
      passengers,
    };
    if (duration) params.flightDuration = duration;
    if (aircraft) params.craftType = aircraft;
    if (date) params.departureDate = new Date(date + "T12:00:00").toISOString();

    if (effectiveType === "sightseeing" && sightseeingFrom) {
      params.from = [{ lat: sightseeingFrom.lat, lng: sightseeingFrom.lng }];
    }
    if (effectiveType === "oneWay") {
      if (onewayFrom)
        params.from = [{ lat: onewayFrom.lat, lng: onewayFrom.lng }];
      if (onewayTo) params.to = [{ lat: onewayTo.lat, lng: onewayTo.lng }];
    }
    if (effectiveType === "excursion") {
      const froms = excursionFroms
        .filter(
          (loc): loc is PickedLocation => loc != null && loc.display != null
        )
        .map((loc) => ({ lat: loc.lat, lng: loc.lng }));
      if (froms.length) params.from = froms;
    }
    return params;
  };

  const handleSearchClick = () => {
    onSearch?.(buildSearchParams());
  };

  const fieldClass =
    "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 h-[54px]";
  const locationButtonClass =
    "flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 h-[54px] cursor-pointer";

  const LocationButton = ({
    display,
    placeholder,
    onOpen,
    prefix,
  }: {
    display: string | undefined;
    placeholder: string;
    prefix: string;
    onOpen: () => void;
  }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      className={locationButtonClass}
    >
      <ImageCustom src={prefix} alt={prefix} className="size-8" />
      <span
        className={cn(
          "flex-1 min-w-0 text-left text-sm truncate",
          display ? "text-gray-900" : "text-gray-500"
        )}
      >
        {display ?? placeholder}
      </span>
      <MapPin className="size-4 sm:size-5 text-primary shrink-0" />
    </div>
  );

  return (
    <div className="w-full bg-white backdrop-blur-sm md:rounded-[24px] rounded-2xl shadow-[0_13px_14.9px_0_rgba(120,84,184,0.08)]">
      <div>
        <div className="border-b border-[#EFEFF0] p-3 sm:p-4 md:p-6 lg:p-[30px]">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-5 md:gap-5 lg:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-[28px] xl:text-[32px] font-semibold text-black">
                {t("bookYourTrip")}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-[22px] font-light text-secondary mt-1">
                {t("chooseBetweenHundredsOfDifferentDestinations")}
              </p>
            </div>
            <div className="bg-[#F6F6F7] p-3 sm:p-4 md:rounded-[24px] rounded-xl">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {TRIP_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTripType(value);
                      setPassengers(1);
                      setDuration("");
                      setDate("");
                      setAircraft("");
                      setSightseeingFrom(null);
                      setOnewayFrom(null);
                      setOnewayTo(null);
                      setExcursionFroms([null]);

                      const apiTourType: TourType = value as TourType;
                      onTourTypeChange?.({
                        tourType: apiTourType,
                        passengers: 1,
                      });
                    }}
                    className={cn(
                      "flex items-center justify-center rounded-lg border px-2 py-3 sm:px-3 sm:py-4 md:py-5 text-base font-medium cursor-pointer bg-white transition-colors",
                      tripType === value
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-600 hover:border-gray-200 hover:text-gray-700"
                    )}
                  >
                    <span>{t(label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-[30px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 bg-[#F6F6F7] lg:p-6 p-3 md:rounded-[24px] rounded-xl ">
            {tripType === "sightseeing" && (
              <LocationButton
                prefix={FROM_ICON}
                display={sightseeingFrom?.display}
                placeholder={t("whereFrom")}
                onOpen={() => openLocationPicker({ type: "sightseeing-from" })}
              />
            )}
            {tripType === "oneWay" && (
              <>
                <LocationButton
                  prefix={FROM_ICON}
                  display={onewayFrom?.display}
                  placeholder={t("from")}
                  onOpen={() => openLocationPicker({ type: "oneway-from" })}
                />
                <LocationButton
                  prefix={TO_ICON}
                  display={onewayTo?.display}
                  placeholder={t("to")}
                  onOpen={() => openLocationPicker({ type: "oneway-to" })}
                />
              </>
            )}
            {tripType === "excursion" && (
              <>
                {excursionFroms.map((loc, i) => (
                  <div key={i} className={fieldClass}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        openLocationPicker({ type: "excursion-from", index: i })
                      }
                      className="flex flex-1 min-w-0 items-center gap-2 cursor-pointer"
                    >
                      <ImageCustom
                        src={FROM_ICON}
                        alt="FROM_ICON"
                        className="size-8"
                      />
                      <span
                        className={cn(
                          "flex-1 min-w-0 text-left text-sm truncate",
                          loc?.display ? "text-gray-900" : "text-gray-500"
                        )}
                      >
                        {loc?.display ?? t("from")}
                      </span>
                      <MapPin className="size-4 sm:size-5 text-primary shrink-0" />
                    </div>
                    {excursionFroms.length > 1 && i > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExcursionFrom(i);
                        }}
                        aria-label="Remove"
                        className="shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExcursionFrom}
                  disabled={
                    excursionFroms.length > 0 &&
                    !excursionFroms[excursionFroms.length - 1]?.display
                  }
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary text-primary h-[54px] hover:bg-primary/5 transition-colors text-sm font-medium col-span-full sm:col-span-2 lg:col-span-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Plus className="size-4 sm:size-5 shrink-0" />
                  {t("add")}
                </button>
              </>
            )}

            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    fieldClass,
                    "w-full cursor-pointer text-left font-normal"
                  )}
                >
                  <ImageCustom alt="CALENDAR_ICON" src={CALENDAR_ICON} />
                  <span
                    className={cn(
                      "flex-1 min-w-0 text-sm truncate",
                      date ? "text-gray-900" : "text-gray-500"
                    )}
                  >
                    {date
                      ? format(new Date(date), "dd-MM-yyyy")
                      : t("selectDate")}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-xl"
              >
                <CalendarUI
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setDate(
                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                      );
                      setDatePickerOpen(false);
                    } else {
                      setDate("");
                    }
                  }}
                  disabled={{ before: new Date() }}
                  initialFocus
                  className="rounded-xl border-0"
                />
              </PopoverContent>
            </Popover>

            <div className={fieldClass}>
              <ImageCustom
                alt="FLIGHT_DURATION_ICON"
                src={FLIGHT_DURATION_ICON}
              />
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="border-0 bg-transparent shadow-none p-0 h-full min-h-0 w-full justify-between gap-2 focus:ring-0">
                  <SelectValue placeholder={t("flightDuration")} />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tripType === "sightseeing" && (
              <div className={fieldClass}>
                <ImageCustom alt="AIRCRAFT_ICON" src={AIRCRAFT_ICON} />
                <Select value={aircraft} onValueChange={setAircraft}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none p-0 h-full min-h-0 w-full justify-between gap-2 focus:ring-0">
                    <SelectValue placeholder={t("aircraftType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {AIRCRAFT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={fieldClass}>
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {t("passengers")}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={passengers <= 1}
                    className="cursor-pointer size-8 rounded-lg border-gray-300 bg-white hover:bg-gray-100"
                    onClick={() => setPassengers((p) => p - 1)}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-6 text-center text-sm font-medium text-gray-800">
                    {passengers}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="cursor-pointer size-8 rounded-lg border-gray-300 bg-white hover:bg-gray-100"
                    onClick={() => setPassengers((p) => p + 1)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSearchClick}
              className="cursor-pointer w-full h-[54px] rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm uppercase tracking-wide sm:col-span-2 lg:col-span-1"
            >
              {t("searchFlights")}
            </Button>
          </div>
        </div>
      </div>

      <LocationPickerModal
        open={locationModalOpen}
        onClose={handleLocationClose}
        onSave={handleLocationSave}
        initialValue={getInitialLocationForEdit()}
      />
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, MapPin, FileText, Plus, Minus, Trash2 } from "lucide-react";
import moment from "moment";
import { cn, convertToUTC } from "@/lib/utils";
import Button from "../common/Button";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form";
import ImageCustom from "../common/Image";
import {
  AIRCRAFT_ICON,
  BAG_ICON,
  FROM_ICON,
  MINUS_ICON,
  PLUS_ICON,
  TIME_ICON,
  TO_ICON,
} from "@/lib/images";
import {
  LocationPickerModal,
  type PickedLocation,
} from "@/components/modals/LocationPickerModal";
import FormProvider from "@/form/FormProvider";
import DatePicker from "@/form/DatePicker";

import { NewFlightRequestSchema } from "@/lib/schema";

const LUGGAGE_OPTIONS = [
  { value: "medium", label: "Medium (bag, ~ 10 kg)" },
  { value: "none", label: "No Luggage" },
];
import { PassengerDetailsFormCard } from "@/components/booking-details";
import type { PassengerDetailsForm } from "@/types/booking";
import TimePickerField from "@/form/TimePickerField";
import { Checkbox } from "../ui/checkbox";
import { useTranslation } from "react-i18next";
import useGetLuggageList from "@/hooks/auth/useGetLuggageList";
import { useCreateNewWishFlight } from "@/hooks/wishlist/useCreateNewWishFlight";
import { profile } from "console";

type FlightType = "sightseeing" | "excursion" | "oneWay";

const FLIGHT_TYPES: FlightType[] = ["sightseeing", "excursion", "oneWay"];

type RouteItem = { display: string; lat?: number; lng?: number; city?: string };

export type NewFlightRequestFormValues = {
  flightType: FlightType;
  routes: RouteItem[];
  date: string;
  startTime: string;
  endTime: string;
  luggage: "medium" | "none";
  passengerCount: number;
  passengers: PassengerDetailsForm[];
  comment: string;
};

const defaultRoute: RouteItem = { display: "" };
const defaultPassenger: PassengerDetailsForm = {
  name: "",
  gender: "",
  age: "",
  weight: "",
  profileImage: null,
};

const defaultValues: NewFlightRequestFormValues = {
  flightType: "sightseeing",
  routes: [{ ...defaultRoute }],
  date: "",
  startTime: "",
  endTime: "",
  luggage: "medium",
  passengerCount: 1,
  passengers: [{ ...defaultPassenger }],
  comment: "",
};

const NewFlightRequest = () => {
  const router = useRouter();
  const { t } = useTranslation("wishlist");
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingRouteIndex, setEditingRouteIndex] = useState<number | null>(
    null
  );

  const { luggageList } = useGetLuggageList();
  const { createNewWishFlight, isPending } = useCreateNewWishFlight();
  const methods = useForm<NewFlightRequestFormValues>({
    defaultValues,
    resolver: yupResolver(
      NewFlightRequestSchema
    ) as unknown as Resolver<NewFlightRequestFormValues>,
    mode: "onSubmit",
  });

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;

  const flightType = watch("flightType");
  const routes = watch("routes");
  const passengerCount = watch("passengerCount");
  const passengers = watch("passengers");
  const startTime = watch("startTime");

  const isSightseeing = flightType === "sightseeing";
  const fromValue = routes[0]?.display ?? "";
  const toValue = routes[1]?.display ?? "";

  const setCount = useCallback(
    (n: number) => {
      const count = Math.max(1, n);
      setValue("passengerCount", count);
      const current = getValues("passengers") ?? [];
      if (count > current.length) {
        const next = [
          ...current,
          ...Array.from({ length: count - current.length }, () => ({
            ...defaultPassenger,
          })),
        ];
        setValue("passengers", next);
      } else if (count < current.length) {
        setValue("passengers", current.slice(0, count));
      }
    },
    [setValue, getValues]
  );

  const addRoute = () =>
    setValue("routes", [...routes, { ...defaultRoute }], {
      shouldValidate: true,
    });

  const removeRoute = (index: number) => {
    if (routes.length <= 1) return;
    const next = routes.filter((_, i) => i !== index);
    setValue("routes", next, { shouldValidate: true });
  };

  const updateRouteByPicker = (index: number, location: PickedLocation) => {
    const next = routes.map((item, i) =>
      i === index
        ? {
            display: location.display,
            lat: location.lat,
            lng: location.lng,
            city: location.city,
          }
        : item
    );
    while (next.length <= index) next.push({ ...defaultRoute });
    setValue("routes", next, { shouldValidate: true });
  };

  const openLocationPicker = (index: number) => {
    if (!isSightseeing && index >= 1 && routes.length < 2) {
      setValue("routes", [...routes, { ...defaultRoute }], {
        shouldValidate: true,
      });
    }
    setEditingRouteIndex(index);
    setLocationModalOpen(true);
  };

  const handleLocationSave = (location: PickedLocation) => {
    if (editingRouteIndex !== null) {
      updateRouteByPicker(editingRouteIndex, location);
    }
    setEditingRouteIndex(null);
  };

  const handleLocationClose = () => {
    setLocationModalOpen(false);
    setEditingRouteIndex(null);
  };

  const onSubmit = (data: any) => {
    // Calculate flight duration in minutes from selected date and start/end times using moment
    let flightDuration = 0;
    if (data?.date && data?.startTime && data?.endTime) {
      const start = moment(
        `${data.date} ${data.startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const end = moment(`${data.date} ${data.endTime}`, "YYYY-MM-DD HH:mm");

      let diffMinutes = end.diff(start, "minutes");

      // Handle overnight flights where end time is on the next day
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }

      flightDuration = diffMinutes;
    }

    createNewWishFlight(
      {
        route: data?.routes?.map((val: any) => ({
          mainLocation: val?.city,
          location: val?.display,
          lat: val?.lat,
          long: val?.lng,
        })),
        passengerInfo: data?.passengers?.map((val: any) => ({
          name: val?.name,
          gender: val?.gender,
          age: val?.age,
          passengersWeight: val?.weight,
          profile: val?.profileImage,
        })),
        tourType: data?.flightType,
        totalPassengers: data?.passengers?.length,
        luggageType: data?.luggage,
        comment: data?.comment,
        departureStartTime: convertToUTC(data?.date, data?.startTime),
        departureEndTime: convertToUTC(data?.date, data?.endTime),
        flightDuration,
      },
      {
        onSuccess: () => {
          router.push("/wishlist");
        },
      }
    );
    // router.push("/wishlist");
  };

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-[30px] font-medium text-black">
          {t("newFlightRequest")}
        </h1>
      </div>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          <div className="bg-white rounded-[20px] shadow-[0px_7px_4.6px_0px_#7854B814] p-4 flex flex-col min-h-0 max-h-[700px]">
            <div className="bg-[#F6F6F7] border border-[#ECECED] rounded-[12px] p-4 shrink-0 mb-5">
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <ImageCustom src={AIRCRAFT_ICON} alt="Flight type" />
                  <p className="text-base font-medium text-black">
                    {t("flightType")}
                  </p>
                </div>
                <div className="w-full flex gap-1.5">
                  {FLIGHT_TYPES.map((type) => (
                    <div
                      key={type}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (type === "sightseeing") {
                          setValue("routes", [{ ...defaultRoute }], {
                            shouldValidate: false,
                          });
                        } else {
                          setValue(
                            "routes",
                            [{ ...defaultRoute }, { ...defaultRoute }],
                            { shouldValidate: false }
                          );
                        }
                        setValue("flightType", type, { shouldValidate: true });
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Enter") return;
                        if (type === "sightseeing") {
                          setValue("routes", [{ ...defaultRoute }], {
                            shouldValidate: false,
                          });
                        } else {
                          setValue(
                            "routes",
                            [{ ...defaultRoute }, { ...defaultRoute }],
                            { shouldValidate: false }
                          );
                        }
                        setValue("flightType", type, { shouldValidate: true });
                      }}
                      className={cn(
                        "flex-1 text-center py-3 text-xs sm:text-sm font-medium rounded-[12px] cursor-pointer",
                        flightType === type
                          ? "bg-primary text-white"
                          : "bg-white text-[#6F6F6F]"
                      )}
                    >
                      {t(type)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 shrink-0">
              <p className="text-base font-medium text-black leading-[30px]">
                {t("selectRoute")}
              </p>
              {isSightseeing && (
                <button
                  type="button"
                  onClick={addRoute}
                  className="cursor-pointer text-sm font-medium text-primary flex items-center gap-1 border border-primary rounded-[6px] px-2.5 py-1"
                >
                  <Plus className="size-4" /> {t("addRoute")}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {isSightseeing ? (
                <div className="space-y-2 mb-4">
                  {routes.map((route, i) => {
                    const routeError =
                      errors.routes && !route?.display?.trim?.();
                    return (
                      <div key={i} className="space-y-1">
                        <div
                          onClick={() => openLocationPicker(i)}
                          className={cn(
                            "flex items-center gap-3 rounded-[12px] border bg-[#F6F6F7] p-3 cursor-pointer transition-colors",
                            routeError ? "border-red-500" : "border-[#ECECED]"
                          )}
                        >
                          <ImageCustom
                            src={FROM_ICON}
                            alt="From"
                            className="size-8"
                          />
                          <div
                            className={cn(
                              "flex-1 min-w-0 text-left text-lg font-normal",
                              route.display ? "text-black" : "text-[#6F6F6F]"
                            )}
                          >
                            {route.display || t("departureFrom")}
                          </div>
                          <MapPin className="size-6 text-primary shrink-0" />
                          {routes.length > 1 && i > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRoute(i);
                              }}
                              aria-label="Remove route"
                              className="cursor-pointer shrink-0 p-1 text-red-400"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          )}
                        </div>
                        {routeError && (
                          <p className="text-sm text-red-500 px-1">
                            {t("fromIsRequired")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-1 mb-4">
                    <div
                      onClick={() => openLocationPicker(0)}
                      className={cn(
                        "flex items-center gap-3 rounded-[12px] border bg-[#F6F6F7] p-3 cursor-pointer transition-colors",
                        errors.routes && !fromValue
                          ? "border-red-500"
                          : "border-[#ECECED]"
                      )}
                    >
                      <ImageCustom
                        src={FROM_ICON}
                        alt="From"
                        className="size-8"
                      />
                      <div
                        className={cn(
                          "flex-1 min-w-0 text-left text-lg font-normal",
                          fromValue ? "text-black" : "text-[#6F6F6F]"
                        )}
                      >
                        {fromValue || t("departureFrom")}
                      </div>
                      <MapPin className="size-6 text-primary shrink-0" />
                    </div>
                    {errors.routes && !fromValue && (
                      <p className="text-sm text-red-500 px-1">
                        {t("fromIsRequired")}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div
                      onClick={() => openLocationPicker(1)}
                      className={cn(
                        "flex items-center gap-3 rounded-[12px] border bg-[#F6F6F7] p-3 cursor-pointer transition-colors",
                        errors.routes && !toValue
                          ? "border-red-500"
                          : "border-[#ECECED]"
                      )}
                    >
                      <ImageCustom src={TO_ICON} alt="To" className="size-8" />
                      <div
                        className={cn(
                          "flex-1 min-w-0 text-left text-lg font-normal",
                          toValue ? "text-black" : "text-[#6F6F6F]"
                        )}
                      >
                        {toValue || t("toDestination")}
                      </div>
                      <MapPin className="size-6 text-primary shrink-0" />
                    </div>
                    {errors.routes && !toValue && (
                      <p className="text-sm text-red-500 px-1">
                        {t("toIsRequired")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <DatePicker
                  name="date"
                  className="py-3.5"
                  placeholder={t("selectDate")}
                  mainClassname={cn(
                    "bg-[#F6F6F7] border border-[#ECECED]",
                    errors.date ? "border-red-500" : ""
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <TimePickerField
                    name="startTime"
                    placeholder={t("startTime")}
                    prefix={<ImageCustom src={TIME_ICON} alt="Time" />}
                  />
                  <TimePickerField
                    name="endTime"
                    placeholder={t("endTime")}
                    minTime={startTime || undefined}
                    prefix={<ImageCustom src={TIME_ICON} alt="Time" />}
                  />
                </div>
              </div>
              <FormField
                control={methods.control}
                name="luggage"
                render={({ field }) => (
                  <div className="bg-[#F6F6F7] border border-[#ECECED] rounded-[12px] p-4 shrink-0">
                    <div className="flex flex-col gap-5">
                      <div className="flex gap-3">
                        <ImageCustom src={BAG_ICON} alt="BAG_ICON" />
                        <p className="text-base text-[#6F6F6F]">
                          {t("luggageInformation")}
                        </p>
                      </div>
                      <div className="space-y-2.5">
                        {luggageList?.map((opt: any) => (
                          <label
                            key={opt.type}
                            className="flex items-center gap-3 cursor-pointer w-fit"
                          >
                            <Checkbox
                              checked={field.value === opt.type}
                              onCheckedChange={(checked) => {
                                if (checked) field.onChange(opt.type);
                              }}
                              className="size-7 rounded-[8px] data-[state=checked]:bg-transparent data-[state=checked]:border-[#8D5BEB] border-[0.5px] border-[#98A1AB] data-[state=checked]:text-[#8D5BEB]"
                            />
                            <span className="sm:text-base text-sm font-light text-black">
                              {opt.title}{" "}
                              {opt?.type != "NoLuggage"
                                ? `(${opt.type}, ~ ${opt.weight} kg)`
                                : ""}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              />
              {errors.luggage?.message && (
                <p className="text-sm text-red-500">{errors.luggage.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-5 sm:p-6 shadow-[0px_7px_4.6px_0px_#7854B814] flex flex-col min-h-0 max-h-[700px]">
            <div className="flex items-center justify-between shrink-0 mb-5 bg-[#F6F6F7] border border-[#ECECED] px-4 py-5 rounded-[12px]">
              <h2 className="text-base text-[#6F6F6F]">{t("passengers")}</h2>
              <div className="flex items-center gap-2">
                <div
                  className="cursor-pointer"
                  onClick={() => setCount(passengerCount - 1)}
                >
                  <ImageCustom src={MINUS_ICON} alt="MINUS_ICON" />
                </div>
                <span className="min-w-[28px] text-center font-semibold text-black">
                  {passengerCount}
                </span>
                <div
                  className="cursor-pointer"
                  onClick={() => setCount(passengerCount + 1)}
                >
                  <ImageCustom src={PLUS_ICON} alt="PLUS_ICON" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pr-1 min-h-0 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(passengers || []).slice(0, passengerCount).map((_, i) => (
                <PassengerDetailsFormCard
                  key={i}
                  index={i}
                  isWishlist
                  fieldPrefix={`passengers.${i}`}
                  className="bg-[#F6F6F7] border border-[#ECECED]"
                />
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-white p-5 sm:p-6 shadow-[0px_7px_4.6px_0px_#7854B814] flex flex-col h-fit">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-black flex items-center gap-2 mb-3">
                <FileText className="size-5 text-[#512D79]" />
                {t("comment")}
              </h2>
              <FormField
                control={methods.control}
                name="comment"
                render={({ field }) => (
                  <>
                    <Textarea
                      {...field}
                      placeholder={t("enterComment")}
                      className={cn(
                        "min-h-[140px] rounded-xl border-[#E5E7EB] resize-none",
                        errors.comment && "border-red-500"
                      )}
                      rows={5}
                    />
                    {errors.comment?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.comment.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-[#512D79] text-lg font-normal"
              disabled={isPending}
              loader={isPending}
            >
              {t("createWishFlight")}
            </Button>
          </div>
        </div>
      </FormProvider>

      <LocationPickerModal
        open={locationModalOpen}
        onClose={handleLocationClose}
        onSave={handleLocationSave}
        initialValue={
          editingRouteIndex != null &&
          routes[editingRouteIndex]?.display &&
          routes[editingRouteIndex].lat != null &&
          routes[editingRouteIndex].lng != null
            ? {
                display: routes[editingRouteIndex].display!,
                lat: routes[editingRouteIndex].lat!,
                lng: routes[editingRouteIndex].lng!,
                city: routes[editingRouteIndex].city,
              }
            : null
        }
      />
    </div>
  );
};

export default NewFlightRequest;

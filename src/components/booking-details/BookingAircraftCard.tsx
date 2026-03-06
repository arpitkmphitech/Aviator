"use client";

import ImageCustom from "@/components/common/Image";
import type { BookingDetailsData } from "@/types/booking";
import { useTranslation } from "react-i18next";

type BookingAircraftCardProps = {
  booking: Pick<
    BookingDetailsData,
    | "aircraftImage"
    | "aircraftModel"
    | "city"
    | "country"
    | "time"
    | "date"
    | "duration"
    | "activityType"
    | "totalPassengers"
    | "pricePerPerson"
  >;
  lampIconSrc: string;
  airplaneIconSrc: string;
  isBookingPage?: boolean;
};

export function BookingAircraftCard({
  booking,
  lampIconSrc,
  airplaneIconSrc,
  isBookingPage = false,
}: BookingAircraftCardProps) {
  const { t } = useTranslation("wishlist");
  return (
    <div className="bg-white rounded-[10px] shadow-7xl py-3 px-3 gap-4 flex items-center">
      <div className="rounded-lg overflow-hidden bg-[#EEEEEE] shrink-0">
        <ImageCustom
          src={booking.aircraftImage}
          alt="aircraftImage"
          className="object-cover w-[114px] h-[135px]"
          width={114}
          height={135}
        />
      </div>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex justify-between items-start gap-2 border-b border-[#ECECED] pb-2">
          <h3 className="font-semibold text-[#2C2C2C] sm:text-base text-sm">
            {booking.aircraftModel}
          </h3>
          <span className="flex items-center gap-1 text-[#6B7280] text-xs font-medium shrink-0">
            <ImageCustom src={lampIconSrc} alt="passengers" />
            {booking.totalPassengers}
          </span>
        </div>
        <div className="pt-2 pb-4 flex justify-between items-center">
          <div className="space-y-1.5">
            <p className="font-semibold text-[#1A1A1A] text-base sm:text-lg">
              {booking.city}
            </p>
            <p className="text-[#6B7280] text-xs font-normal">
              {booking.country}
            </p>
            <span className="text-xs font-medium text-[#1A1A1A]">
              {booking.time}{" "}
              <span className="text-sm font-light text-[#98A1AB]">|</span>{" "}
              {booking.date}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-semibold text-[#2C2C2C]">
              {booking.duration}
            </p>
            <div className="flex items-center justify-center">
              <ImageCustom src={airplaneIconSrc} alt="airplane" />
              <div className="border border-dashed border-[#DBE3EB] w-[100px] h-px" />
              <div className="size-[5px] rounded-full bg-[#DBE3EB]" />
            </div>
            <p className="text-xs font-normal text-[#98A1AB] capitalize">
              {booking.activityType === "oneWay"
                ? t("oneWay")
                : booking.activityType}
            </p>
            {isBookingPage && (
              <p className="text-primary text-base font-medium">
                €{booking.pricePerPerson} - {booking.totalPassengers} person
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import ImageCustom from "@/components/common/Image";
import { WEIGHT_PURPLE_ICON } from "@/lib/images";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import LuggageDisplay from "../common/LuggageDisplay";

type StatCardProps = {
  title: string;
  value: string | React.ReactNode;
  iconSrc: string;
  iconAlt: string;
};

function StatCard({ title, value, iconSrc, iconAlt }: StatCardProps) {
  return (
    <div className="gap-3 p-3 rounded-lg bg-white shadow-7xl">
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <ImageCustom src={iconSrc} alt={iconAlt} />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {title}
        </h2>
      </div>
      <p className="sm:text-base text-sm font-light text-[#6F6F6F]">{value}</p>
    </div>
  );
}

type BookingStatsCardsProps = {
  passengersWeightKg: string;
  totalPassengers: string;
  aircraftType: string;
  weightIconSrc: string;
  groupIconSrc: string;
  airplaneIconSrc: string;
  isBookingPage?: boolean;
  luggageCapacity?: string;
  className?: string;
};

export function BookingStatsCards({
  passengersWeightKg,
  totalPassengers,
  aircraftType,
  weightIconSrc,
  groupIconSrc,
  airplaneIconSrc,
  isBookingPage = false,
  luggageCapacity = "",
  className,
}: BookingStatsCardsProps) {
  const { t } = useTranslation("home");
  return (
    <div
      className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", className)}
    >
      <StatCard
        title={t("passengersWeight")}
        value={passengersWeightKg}
        iconSrc={weightIconSrc}
        iconAlt="weight"
      />
      <StatCard
        title={t("passenger")}
        value={totalPassengers}
        iconSrc={groupIconSrc}
        iconAlt="passengers"
      />
      <StatCard
        title={t("aircraftType")}
        value={aircraftType}
        iconSrc={airplaneIconSrc}
        iconAlt="aircraft"
      />
      {isBookingPage && (
        <StatCard
          title={t("luggageCapacity")}
          value={<LuggageDisplay luggageType={luggageCapacity} />}
          iconSrc={WEIGHT_PURPLE_ICON}
          iconAlt="WEIGHT_PURPLE_ICON"
        />
      )}
    </div>
  );
}

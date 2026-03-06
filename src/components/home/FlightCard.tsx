"use client";

import moment from "moment";
import { useRouter } from "next/navigation";
import ImageCustom from "../common/Image";
import type { IFlightAvailabilityItem } from "@/types/home";
import { AIRPLANE_ICON, LAMP_ICON } from "@/lib/images";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

interface FlightCardProps {
  flight: IFlightAvailabilityItem;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  showCheckbox?: boolean;
  checkboxDisabled?: boolean;
}

const FlightCard = ({
  flight,
  checked = false,
  onCheckedChange,
  showCheckbox = false,
  checkboxDisabled = false,
}: FlightCardProps) => {
  const router = useRouter();
  const { t } = useTranslation("wishlist");

  return (
    <article
      className="bg-white rounded-[10px] overflow-hidden shadow-7xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/home/${flight.availabilityId}`)}
    >
      <div className="bg-[#EEEEEE]">
        <ImageCustom
          src={flight.airCraftData?.safetyImage}
          alt={flight.airCraftData?.craftModel}
          className="object-cover w-full h-[205px]"
          height={205}
        />
      </div>
      <div className="flex justify-between items-start gap-2 border-b border-[#ECECED] py-3 mx-4">
        <h3 className="font-semibold text-[#2C2C2C] sm:text-base text-sm">
          {flight.airCraftData?.craftModel}
        </h3>
        <span className="flex items-center gap-2.5 text-[#6B7280] text-xs font-medium shrink-0">
          <div className="flex items-center gap-1">
            <ImageCustom src={LAMP_ICON} alt="lamp" />
            {flight.pendingSeatCount}
          </div>
          {showCheckbox && (
            <Checkbox
              checked={checked}
              disabled={checkboxDisabled}
              onCheckedChange={(c) => onCheckedChange?.(!!c)}
              onClick={(e) => e.stopPropagation()}
              className="size-5 rounded border-[#6B7280] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        </span>
      </div>
      <div className="px-4 pt-3 pb-4 flex justify-between items-center gap-2">
        <div className="space-y-2.5">
          <p className="font-semibold text-primary text-base sm:text-lg">
            €{flight.perPersonAmount.toFixed(2)}
          </p>
          <p className="font-semibold text-[#1A1A1A] text-base sm:text-lg">
            {flight.route?.[0]?.mainLocation ?? ""}
          </p>
          <p className="text-[#6B7280] text-xs font-normal">
            {flight.route?.[0]?.location?.split(", ").pop() ?? ""}
          </p>
          <div className="flex justify-between items-center gap-2 text-[#6B7280] text-sm">
            <span className="text-xs font-medium text-[#1A1A1A]">
              {moment(flight.departureStartTime).format("HH:mm")}{" "}
              <span className="text-sm font-light text-[#98A1AB]">|</span>{" "}
              {moment(flight.departureStartTime).format("MMM D, yyyy")}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-xs font-semibold text-[#2C2C2C]">
            {Math.floor(flight.flightDuration / 60)}h{" "}
            {flight.flightDuration % 60}m
          </p>
          <div className="flex items-center justify-center">
            <ImageCustom src={AIRPLANE_ICON} alt="airplane" />
            <div className="border border-dashed border-[#DBE3EB] w-[100px] h-px "></div>
            <div className="size-[5px] rounded-full bg-[#DBE3EB]"> </div>
          </div>
          <p className="text-xs font-normal text-[#98A1AB] capitalize">
            {flight.tourType?.[0] === "oneWay"
              ? t("oneWay")
              : flight.tourType?.[0]}
          </p>
        </div>
      </div>
    </article>
  );
};

export default FlightCard;

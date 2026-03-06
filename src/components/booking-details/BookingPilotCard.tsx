"use client";

import ImageCustom from "@/components/common/Image";
import type { PilotInfo } from "@/types/booking";
import Link from "next/link";
import { useTranslation } from "react-i18next";

type BookingPilotCardProps = {
  pilot: PilotInfo;
  starIconSrc: string;
};

export function BookingPilotCard({
  pilot,
  starIconSrc,
}: BookingPilotCardProps) {
  const { t } = useTranslation("home");
  return (
    <div className="bg-white rounded-[10px] shadow-7xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="size-14 rounded-full overflow-hidden bg-[#EEEEEE] shrink-0">
          <ImageCustom
            src={pilot.profileImage}
            alt={pilot.name}
            className="object-cover w-[78px] h-[78px] rounded-full"
            width={78}
            height={78}
          />
        </div>
        <div>
          <p className="font-medium text-[#2C2C2C] sm:text-[22px] text-lg">
            {pilot.name}
          </p>
          <span className="flex items-center gap-1 sm:text-lg font-normal text-base text-[#6B7280]">
            <ImageCustom src={starIconSrc} alt="star" />{" "}
            {pilot.avgRating?.toFixed(2)}
          </span>
        </div>
      </div>
      <Link
        href={`/home/pilot/${pilot.pilotId}`}
        className="text-primary sm:text-xl text-lg font-medium underline"
      >
        {t("viewProfile")}
      </Link>
    </div>
  );
}

"use client";

import ImageCustom from "@/components/common/Image";
import { useTranslation } from "react-i18next";

type MeetingPointCardProps = {
  meetingPointText: string;
  iconSrc: string;
};

export function MeetingPointCard({
  meetingPointText,
  iconSrc,
}: MeetingPointCardProps) {
  const { t } = useTranslation("home");
  return (
    <div className="bg-white rounded-xl shadow-7xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <ImageCustom src={iconSrc} alt="meeting point" />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {t("meetingPoint")}
        </h2>
      </div>
      <p className="text-[#1F1F1F] sm:text-lg text-base font-light">
        {meetingPointText}
      </p>
    </div>
  );
}

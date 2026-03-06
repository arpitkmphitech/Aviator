"use client";

import ImageCustom from "@/components/common/Image";
import { useTranslation } from "react-i18next";

type BookingDescriptionCardProps = {
  description: string;
  iconSrc: string;
};

export function BookingDescriptionCard({
  description,
  iconSrc,
}: BookingDescriptionCardProps) {
  const { t } = useTranslation("home");
  return (
    <div className="bg-white rounded-[10px] shadow-7xl p-4 h-fit">
      <div className="flex items-center gap-2 mb-3 border-b border-[#ECECED] pb-3.5">
        <ImageCustom
          src={iconSrc}
          alt="description"
          className="size-5 object-contain"
        />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {t("description")}
        </h2>
      </div>
      <p className="sm:text-base text-sm text-[#6F6F6F] font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
}

"use client";

import ImageCustom from "@/components/common/Image";
import { useTranslation } from "react-i18next";

type BookingFeaturesCardProps = {
  features: string[];
  iconSrc: string;
  checkIconSrc: string;
};

export function BookingFeaturesCard({
  features,
  iconSrc,
  checkIconSrc,
}: BookingFeaturesCardProps) {
  const { t } = useTranslation("home");
  return (
    <div className="bg-white rounded-[10px] shadow-7xl p-4">
      <div className="flex items-center gap-2 mb-3 border-b border-[#ECECED] pb-3.5">
        <ImageCustom src={iconSrc} alt="features" />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {t("features")}
        </h2>
      </div>
      <ul className="space-y-3 pt-1">
        {features.map((feature, i) => (
          <li
            key={i}
            className="flex items-center gap-2 sm:text-base text-sm text-[#6B7280] font-light"
          >
            <ImageCustom src={checkIconSrc} alt="checkIconSrc" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import ImageCustom from "@/components/common/Image";
import { Checkbox } from "@/components/ui/checkbox";
import { LUGGAGE_OPTIONS } from "@/lib/statics";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export type LuggageOption = { value: string; label: string };

type LuggageSectionProps = {
  selectedLuggage: string;
  onSelect: (value: string) => void;
  iconSrc: string;
  options?: LuggageOption[];
};

export function LuggageSection({
  selectedLuggage,
  onSelect,
  iconSrc,
  options,
}: LuggageSectionProps) {
  const { t } = useTranslation("home");

  return (
    <div className="bg-white rounded-xl shadow-7xl p-4 mb-6 lg:mb-0 h-fit">
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <ImageCustom src={iconSrc} alt="luggage" />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {t("luggageWeight")}
        </h2>
      </div>
      <div className="space-y-1">
        {(options ?? []).map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2"
            )}
          >
            <Checkbox
              checked={selectedLuggage === opt.value}
              onCheckedChange={(checked) => {
                if (checked) onSelect(opt.value);
              }}
              className="size-5 rounded-[6px] data-[state=checked]:bg-[#F5F5F5] data-[state=checked]:border-[#8D5BEB] border-[0.5px] border-[#6F6F6F] data-[state=checked]:text-[#8D5BEB]"
            />
            <span className="sm:text-base text-sm font-light text-[#6F6F6F]">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

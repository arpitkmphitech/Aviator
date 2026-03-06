"use client";
import ImageCustom from "@/components/common/Image";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const CHECKBOX_CLASS =
  "size-5 rounded-[6px] data-[state=checked]:bg-[#F5F5F5] data-[state=checked]:border-[#8D5BEB] border-[0.5px] border-[#6F6F6F] data-[state=checked]:text-[#8D5BEB]";

type PassengerOption = {
  value: string;
  label: string;
};

type PassengerSelectSectionProps = {
  selectedPassengers: string;
  onSelect: (value: string) => void;
  userIconSrc: string;
  options: PassengerOption[];
};

export function PassengerSelectSection({
  selectedPassengers,
  onSelect,
  userIconSrc,
  options,
}: PassengerSelectSectionProps) {
  const { t } = useTranslation("home");
  return (
    <div className="bg-white rounded-xl shadow-7xl p-4 mb-6 h-fit">
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <ImageCustom src={userIconSrc} alt="passengers" />
        <h2 className="text-[#6F6F6F] sm:text-lg text-base font-light">
          {t("passengers")}
        </h2>
      </div>
      {options?.length ? (
        <div className="space-y-1">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 w-fit"
              )}
            >
              <Checkbox
                checked={selectedPassengers === opt.value}
                onCheckedChange={(checked) => {
                  if (checked) onSelect(opt.value);
                }}
                className={CHECKBOX_CLASS}
              />
              <span className="sm:text-base text-sm font-light text-[#6F6F6F]">
                {opt.label}
              </span>
            </label>
          ))}
          <span className="text-sm font-light text-[#6F6F6F]">
            {t("ifMorePassengersJoinRefundedAfterFlight")}
          </span>
        </div>
      ) : (
        0
      )}
    </div>
  );
}

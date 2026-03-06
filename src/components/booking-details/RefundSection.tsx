"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { REFUND_RANGE_OPTIONS } from "@/lib/statics";
import { cn } from "@/lib/utils";

const CHECKBOX_CLASS =
  "size-5 rounded-[6px] data-[state=checked]:bg-[#F5F5F5] data-[state=checked]:border-[#8D5BEB] border-[0.5px] border-[#6F6F6F] data-[state=checked]:text-[#8D5BEB]";

type RefundSectionProps = {
  selectedRefund: string;
  onSelect: (value: string) => void;
};

export function RefundSection({
  selectedRefund,
  onSelect,
}: RefundSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-7xl p-4 mb-6">
      <div className="space-y-1">
        {REFUND_RANGE_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2"
            )}
          >
            <Checkbox
              checked={selectedRefund === opt.value}
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
      </div>
    </div>
  );
}

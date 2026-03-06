"use client";

import ImageCustom from "@/components/common/Image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useUpdateLanguage,
  useUpdateProfile,
} from "@/hooks/profile/useUpdateProfile";
import { DOWN_ARROW_ICON, GERMANY_FLAG, US_FLAG } from "@/lib/images";
import { LANGUAGE_OPTIONS } from "@/lib/statics";
import { cn } from "@/lib/utils";
import { IEditProfile } from "@/types/auth";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FLAG_BY_LANG: Record<string, string> = {
  en: US_FLAG,
  de: GERMANY_FLAG,
};

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<"en" | "de">("en");
  const { updateLanguage } = useUpdateLanguage();

  useEffect(() => {
    setLanguage(i18n.language === "de" ? "de" : "en");
  }, [i18n.language]);

  const currentFlag = FLAG_BY_LANG[language] ?? US_FLAG;
  const currentShortLabel = language === "de" ? "DE" : "EN";

  const handleChange = (value: string) => {
    updateLanguage({ lang: value } as IEditProfile);
    i18n.changeLanguage(value);
  };

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="border border-[#ECECED] rounded-[12px] p-1.5 flex items-center gap-2.5 bg-transparent cursor-pointer"
          suppressHydrationWarning
        >
          <ImageCustom
            src={currentFlag}
            alt="currentFlag"
            className="sm:w-[38px] sm:h-[38px] w-[32px] h-[32px]"
            width={38}
            height={38}
          />
          <p className="sm:text-lg text-base font-medium text-[#1F1F1F]">
            {currentShortLabel}
          </p>
          <ImageCustom
            src={DOWN_ARROW_ICON}
            alt="DOWN_ARROW_ICON"
            className="sm:w-[10px] sm:h-[6px] w-[8px] h-[5px]"
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        sideOffset={8}
        align="end"
        className="z-100 w-[min(250px,90vw)] rounded-2xl bg-white p-3 shadow-md"
      >
        <RadioGroup
          value={language}
          onValueChange={handleChange}
          className="grid gap-0"
        >
          {LANGUAGE_OPTIONS.map((opt, index) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                index === 0 && "border-b border-[#ECECED]"
              )}
            >
              <ImageCustom
                src={FLAG_BY_LANG[opt.value]}
                alt="FLAG_BY_LANG"
                className="w-[28px] h-[28px] shrink-0 rounded object-cover"
                width={28}
                height={28}
              />
              <span
                className={cn(
                  "flex-1 sm:text-lg text-base",
                  language === opt.value
                    ? "text-primary font-semibold"
                    : "text-[#6B7280] font-medium"
                )}
              >
                {opt.label}
              </span>
              <RadioGroupItem
                value={opt.value}
                className="border-primary text-primary size-6 rounded-[11px]"
              />
            </label>
          ))}
        </RadioGroup>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}

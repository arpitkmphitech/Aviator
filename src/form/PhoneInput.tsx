import type { ICountryItem, IPhoneInputField } from "@/types/form";
import { countries } from "@/data/country";

export const getFlagEmoji = (code: string) =>
  code
    .toUpperCase()
    .replace(/./g, (char: string) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );

export const formatPhone = (value: string, format: string) => {
  const digits = value.replace(/\D/g, "");
  let i = 0;
  return format.replace(/#/g, () => digits[i++] || "");
};

export const getCountryByFlag = (flag: string): ICountryItem | undefined =>
  countries.find((c) => c.flag === flag);

export function parseFullNumber(
  value: string | null | undefined,
  countryList: ICountryItem[] = countries
): { country: ICountryItem; nationalDigits: string } | null {
  if (!value || typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  if (!digits.length) return null;
  const sorted = [...countryList].sort(
    (a, b) => (b.cCode?.length ?? 0) - (a.cCode?.length ?? 0)
  );
  for (const c of sorted) {
    const codeDigits = (c.cCode ?? "").replace(/\D/g, "");
    if (codeDigits && digits.startsWith(codeDigits)) {
      const national = digits.slice(codeDigits.length);
      return { country: c, nationalDigits: national };
    }
  }
  return null;
}

export function getDisplayFromValue(
  value: string | null | undefined,
  selectedFallback: ICountryItem,
  countryList: ICountryItem[] = countries
): { country: ICountryItem; nationalDigits: string } {
  if (!value || typeof value !== "string") {
    return { country: selectedFallback, nationalDigits: "" };
  }
  const trimmed = value.trim();
  if (trimmed.startsWith("+") || trimmed.length > 12) {
    const parsed = parseFullNumber(value, countryList);
    if (parsed)
      return { country: parsed.country, nationalDigits: parsed.nationalDigits };
  }
  const digits = value.replace(/\D/g, "");
  return { country: selectedFallback, nationalDigits: digits };
}

import React from "react";
import { useState, useMemo, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { get } from "lodash";
import { cn } from "@/lib/utils";

const defaultCountryByFlag = (flag: string): ICountryItem =>
  countries.find((c) => c.flag === flag) || countries[0];

export default function PhoneInput({
  name = "phone",
  name1 = "cCode",
  name2 = "flag",
  defaultCountry = "IN",
  placeholder = "Enter mobile number",
  className,
}: IPhoneInputField) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fieldError = get(errors, name);

  const defaultCountryObj = useMemo(
    () =>
      typeof defaultCountry === "string"
        ? defaultCountryByFlag(defaultCountry)
        : countries[0],
    [defaultCountry]
  );

  const [selected, setSelected] = useState<ICountryItem>(defaultCountryObj);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const watchedPhone = useWatch({ control, name, defaultValue: "" });
  const watchedFlag = useWatch({
    control,
    name: name2 ?? "flag",
    defaultValue: "",
  });
  const watchedCcode = useWatch({
    control,
    name: name1 ?? "cCode",
    defaultValue: "",
  });

  const filteredCountries = useMemo(
    () =>
      countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.cCode ?? "").includes(search)
      ),
    [search]
  );

  useEffect(() => {
    if (
      watchedFlag &&
      typeof watchedFlag === "string" &&
      watchedFlag !== selected.flag
    ) {
      const byFlag = getCountryByFlag(watchedFlag);
      if (byFlag) setSelected(byFlag);
    }
  }, [watchedFlag]);

  useEffect(() => {
    if (
      watchedPhone &&
      typeof watchedPhone === "string" &&
      watchedPhone.trim().startsWith("+")
    ) {
      const parsed = parseFullNumber(watchedPhone);
      if (parsed && parsed.country.flag !== selected.flag) {
        setSelected(parsed.country);
      }
    }
  }, [watchedPhone, selected.flag]);

  useEffect(() => {
    const phoneEmpty = !watchedPhone || String(watchedPhone).trim() === "";
    const nextCcode = phoneEmpty ? "" : (selected.cCode ?? "");
    const nextFlag = phoneEmpty ? "" : (selected.flag ?? "");
    const currentCcode = String(watchedCcode ?? "");
    const currentFlag = String(watchedFlag ?? "");
    if (name1 && nextCcode !== currentCcode)
      setValue(name1, nextCcode, { shouldDirty: false, shouldTouch: false });
    if (name2 && nextFlag !== currentFlag)
      setValue(name2, nextFlag, { shouldDirty: false, shouldTouch: false });
  }, [
    watchedPhone,
    watchedCcode,
    watchedFlag,
    selected.flag,
    selected.cCode,
    name1,
    name2,
    setValue,
  ]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => {
        const { country: displayCountry, nationalDigits } = getDisplayFromValue(
          field.value,
          selected
        );
        const displayValue = nationalDigits
          ? formatPhone(nationalDigits, displayCountry.format || "##########")
          : "";

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const input = e.target;
          const stored = (field.value || "").toString();
          const prev = getDisplayFromValue(stored, selected);
          const prevNational = prev.nationalDigits;
          const inputDigits = input.value.replace(/\D/g, "");
          const hasPlus = input.value.includes("+");
          const isDeleting = input.value.length < displayValue.length;

          let national = inputDigits;

          if (
            hasPlus ||
            inputDigits.length > (displayCountry.maxLength ?? 15)
          ) {
            const parsed = parseFullNumber(hasPlus ? input.value : inputDigits);
            if (parsed) {
              const capped = parsed.nationalDigits.slice(
                0,
                parsed.country.maxLength ?? 15
              );
              if (parsed.country.flag !== selected.flag)
                setSelected(parsed.country);
              field.onChange(capped);
              return;
            }
          }

          if (
            isDeleting &&
            national.length === prevNational.length &&
            prevNational.length > 0
          ) {
            const digitsBeforeCursor = input.value
              .slice(0, input.selectionStart ?? 0)
              .replace(/\D/g, "").length;
            const removeIndex = digitsBeforeCursor - 1;
            if (removeIndex >= 0) {
              national =
                prevNational.slice(0, removeIndex) +
                prevNational.slice(removeIndex + 1);
            }
          }

          const maxLen = displayCountry.maxLength ?? 15;
          if (national.length > maxLen) national = national.slice(0, maxLen);

          field.onChange(national || "");
        };

        return (
          <div className="space-y-1.5 sm:space-y-2.5">
            <div className="space-y-1">
              <div className="relative w-full">
                <div
                  className={cn(
                    "flex items-center border rounded-[12px] min-h-[52px] sm:min-h-[58px] h-[52px] sm:h-[58px] bg-[#F6F6F7] border-border hover:border-main transition-colors w-full pl-4 pr-4",
                    fieldError?.message
                      ? "focus-visible:ring-red-500 border-red-500 hover:border-red-500"
                      : "focus-within:ring-1 focus-within:ring-main focus-within:border-main",
                    className
                  )}
                >
                  <div
                    className="flex items-center gap-1.5 cursor-pointer shrink-0"
                    onClick={() => setOpen(!open)}
                  >
                    <ReactCountryFlag
                      style={{ fontSize: 22 }}
                      svg
                      countryCode={selected.flag}
                    />
                    <ChevronDown className="text-[#7E808C] size-4 shrink-0" />
                  </div>

                  <span className="text-base md:text-lg ml-2 shrink-0">
                    +{selected.cCode}
                  </span>

                  <input
                    className={cn(
                      "w-full min-w-0 outline-none bg-transparent text-base md:text-lg placeholder:text-secondary placeholder:font-normal font-normal flex-1 ml-1"
                    )}
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={handleChange}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("Text");
                      const parsed = parseFullNumber(pasted);
                      if (parsed) {
                        const capped = parsed.nationalDigits.slice(
                          0,
                          parsed.country.maxLength ?? 15
                        );
                        if (parsed.country.flag !== selected.flag)
                          setSelected(parsed.country);
                        field.onChange(capped);
                      } else {
                        const digits = pasted
                          .replace(/\D/g, "")
                          .slice(0, selected.maxLength ?? 15);
                        field.onChange(digits);
                      }
                    }}
                    maxLength={
                      selected.format?.replace(/#/g, "0")?.length ?? 15
                    }
                  />
                </div>

                {open && (
                  <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto border border-border bg-popover rounded-[12px] shadow-md">
                    <input
                      className="w-full p-2 border-b outline-none"
                      placeholder="Search country..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {filteredCountries.map((c) => (
                      <div
                        key={c.flag}
                        onClick={() => {
                          setSelected(c);
                          setOpen(false);
                          setSearch("");
                          field.onChange("");
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <ReactCountryFlag
                          style={{ fontSize: 24 }}
                          svg
                          countryCode={c.flag}
                        />
                        <span className="flex-1">{c.name}</span>
                        <span className="text-gray-500">+{c.cCode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {fieldError?.message && (
                <div className="pt-1 pl-3 text-xs sm:text-sm font-normal text-red-500">
                  {String(fieldError.message)}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FormProvider from "@/form/FormProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CLOSE_ICON,
  FLIGHT_TIME_ICON,
  AIRCRAFT_ICON,
  EURO_ICON,
  MINUS_ICON,
  PLUS_ICON,
} from "@/lib/images";
import ImageCustom from "../common/Image";
import Button from "../common/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePicker from "@/form/DatePicker";
import { useTranslation } from "react-i18next";

const DURATION_OPTIONS = [
  { value: "short", label: "Short Flights (<60m)", count: 0 },
  { value: "classic", label: "Classic Flights (1h - 1h 15m)", count: 0 },
  { value: "extended", label: "Extended Flights (1h 16m - 2h)", count: 0 },
  { value: "long", label: "Long Adventures (2h+)", count: 0 },
];

const AIRCRAFT_OPTIONS = [
  { value: "gliders", label: "Gliders" },
  { value: "plane", label: "Plane" },
  { value: "helicopter", label: "Helicopter" },
];

const PRICE_RANGES = [
  { value: "0-80", label: "< €80 (Short flight / Trial flight)" },
  { value: "80-150", label: "€80 - €150" },
  { value: "150-300", label: "€150 - €300" },
  { value: "300-600", label: "€300 - €600" },
  { value: "600-1000", label: "€600 - €1,000" },
];

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPriceRange: (
    range: { priceMin: number; priceMax: number } | null
  ) => void;
  priceRange: string;
}

interface FilterFormValues {
  date: string;
  flightDuration: string;
  aircraftType: string;
  priceRange: string;
  passengers: number;
}

const defaultValues: FilterFormValues = {
  date: "",
  flightDuration: "",
  aircraftType: "",
  priceRange: "",
  passengers: 2,
};

export function FilterModal({
  open,
  onOpenChange,
  onApplyPriceRange,
  priceRange,
}: FilterModalProps) {
  const { t } = useTranslation("home");
  const methods = useForm<FilterFormValues>({
    defaultValues,
  });

  useEffect(() => {
    methods.setValue("priceRange", priceRange);
  }, [priceRange, methods]);

  const handleReset = () => {
    methods.setValue("priceRange", "");
    onApplyPriceRange(null);
    onOpenChange(false);
  };

  const handleApply = (values: FilterFormValues) => {
    if (values.priceRange) {
      const [minStr, maxStr] = values.priceRange.split("-");
      const priceMin = Number(minStr);
      const priceMax = Number(maxStr);

      if (!Number.isNaN(priceMin) && !Number.isNaN(priceMax)) {
        onApplyPriceRange({ priceMin, priceMax });
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[660px] w-[95%] gap-5 max-h-[90vh] p-6 rounded-[32px] overflow-hidden flex flex-col bg-[linear-gradient(180deg,#FAFAFC_0%,#F5F5F5_80.54%)]"
      >
        <div className="text-center border-b border-[#ECECED] pb-6 relative shrink-0">
          <h3 className="text-4xl font-semibold text-black">{t("filter")}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 flex items-center justify-center size-12"
          >
            <ImageCustom src={CLOSE_ICON} alt="Close" className="size-12" />
          </button>
        </div>

        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(handleApply)}
          className="flex-1 min-h-0 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex flex-col pb-5 gap-5">
              {/* <DatePicker
                name="date"
                placeholder={t("selectDate")}
                mainClassname="border-none"
              /> */}

              {/* <Accordion
                type="single"
                collapsible
                defaultValue="flight-duration"
                className="rounded-[12px] bg-white"
              >
                <AccordionItem
                  value="flight-duration"
                  className="border-0 px-4"
                >
                  <AccordionTrigger className="cursor-pointer hover:no-underline py-5 text-[#6F6F6F] font-light text-base">
                    <div className="flex gap-3 items-center">
                      <img src={FLIGHT_TIME_ICON} alt="Flight Time" />
                      {t("flightDuration")}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-0">
                    <FormField
                      control={methods.control}
                      name="flightDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col gap-3"
                            >
                              {DURATION_OPTIONS.map(
                                ({ value, label, count }) => (
                                  <label
                                    key={value}
                                    className="flex items-center gap-3 cursor-pointer w-fit"
                                  >
                                    <RadioGroupItem
                                      value={value}
                                      className="size-[36px] rounded-[11px] border-[#98A1AB] bg-[#F5F5F5]"
                                    />
                                    <span className="text-base font-light text-[#2C2C2C]">
                                      {label} ({count})
                                    </span>
                                  </label>
                                )
                              )}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> */}

              {/* <div className="bg-white p-4 flex flex-col gap-3.5 rounded-[12px]">
                <span className="text-sm font-light text-[#6F6F6F]">
                  {t("passengers")}
                </span>
                <FormField
                  control={methods.control}
                  name="passengers"
                  render={({ field }) => (
                    <div className="flex items-center gap-2.5">
                      <div
                        className="cursor-pointer size-[22px]"
                        onClick={() =>
                          field.onChange(Math.max(1, field.value - 1))
                        }
                      >
                        <ImageCustom src={MINUS_ICON} alt="Minus" />
                      </div>
                      <span className="w-fit text-center text-base font-normal text-black">
                        {field.value}
                      </span>
                      <div
                        className="cursor-pointer size-[22px]"
                        onClick={() => field.onChange(field.value + 1)}
                      >
                        <ImageCustom src={PLUS_ICON} alt="Plus" />
                      </div>
                    </div>
                  )}
                />
              </div> */}

              <Accordion
                type="single"
                collapsible
                defaultValue="price-range"
                className="rounded-[12px] bg-white"
              >
                <AccordionItem value="price-range" className="border-0 px-4">
                  <AccordionTrigger className="cursor-pointer hover:no-underline py-5 text-[#6F6F6F] font-light text-base">
                    <div className="flex gap-3 items-center">
                      <img src={EURO_ICON} alt="EURO_ICON" />
                      {t("priceRange")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
                    <FormField
                      control={methods.control}
                      name="priceRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col gap-3"
                            >
                              {PRICE_RANGES.map(({ value, label }) => (
                                <label
                                  key={value}
                                  className="flex items-center gap-3 cursor-pointer w-fit"
                                >
                                  <RadioGroupItem
                                    value={value}
                                    className="size-[36px] rounded-[11px] border-[#98A1AB] bg-[#F5F5F5]"
                                  />
                                  <span className="text-base font-light text-[#2C2C2C]">
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* <Accordion
                type="single"
                collapsible
                defaultValue="aircraft-type"
                className="rounded-[12px] bg-white"
              >
                <AccordionItem value="aircraft-type" className="border-0 px-4">
                  <AccordionTrigger className="cursor-pointer hover:no-underline py-5 text-[#6F6F6F] font-light text-base">
                    <div className="flex gap-3 items-center">
                      <img src={AIRCRAFT_ICON} alt="Aircraft" />
                      {t("aircraftType")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
                    <FormField
                      control={methods.control}
                      name="aircraftType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col gap-3"
                            >
                              {AIRCRAFT_OPTIONS.map(({ value, label }) => (
                                <label
                                  key={value}
                                  className="flex items-center gap-3 cursor-pointer w-fit"
                                >
                                  <RadioGroupItem
                                    value={value}
                                    className="size-[36px] rounded-[11px] border-[#98A1AB] bg-[#F5F5F5]"
                                  />
                                  <span className="text-base font-light text-[#2C2C2C]">
                                    {label}
                                  </span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion> */}
            </div>

            <div className="flex gap-4 pt-5 sticky bottom-0 z-10 bg-[linear-gradient(180deg,#FAFAFC_0%,#F5F5F5_80.54%)]">
              <Button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-white text-[#98A1AB]"
              >
                {t("reset")}
              </Button>
              <Button type="submit" className="flex-1">
                {t("apply")}
              </Button>
            </div>
          </ScrollArea>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

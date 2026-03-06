"use client";

import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IFieldError, ITimePickerField } from "@/types/form";
import { useState, useRef, useEffect, RefObject } from "react";

const TimePickerContent: React.FC<{
  value: string;
  onChange: (value: string) => void;
  minTime?: string;
  maxTime?: string;
}> = ({ value, onChange, minTime }) => {
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  const getCurrentTime = () => {
    const now = new Date();
    const hour24 = now.getHours();
    const mins = now.getMinutes();
    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? "PM" : "AM";
    return { hour: hour12, minute: mins, period: period as "AM" | "PM" };
  };

  const parseTimeString = (timeString: string) => {
    if (!timeString) return getCurrentTime();
    try {
      const [hours, minutes] = timeString.split(":");
      const hour24 = parseInt(hours, 10);
      const mins = parseInt(minutes, 10);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 >= 12 ? "PM" : "AM";
      return { hour: hour12, minute: mins, period: period as "AM" | "PM" };
    } catch {
      return getCurrentTime();
    }
  };

  const formatTimeForForm = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    let hour24 = hour;
    if (period === "PM" && hour !== 12) {
      hour24 = hour + 12;
    } else if (period === "AM" && hour === 12) {
      hour24 = 0;
    }
    return `${hour24.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const parsedTime = parseTimeString(value);
  const [hours, setHours] = useState(parsedTime.hour);
  const [minutes, setMinutes] = useState(parsedTime.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsedTime.period);

  useEffect(() => {
    const parsed = parseTimeString(value);
    setHours(parsed.hour);
    setMinutes(parsed.minute);
    setPeriod(parsed.period);
  }, [value]);

  useEffect(() => {
    setTimeout(() => {
      if (hourScrollRef.current) {
        const itemHeight = 40;
        hourScrollRef.current.scrollTo({
          top: (hours - 1) * itemHeight,
          behavior: "smooth",
        });
      }
      if (minuteScrollRef.current) {
        const itemHeight = 40;
        minuteScrollRef.current.scrollTo({
          top: minutes * itemHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  }, []);

  const generateHours = () => Array.from({ length: 12 }, (_, i) => i + 1);
  const generateMinutes = () => Array.from({ length: 60 }, (_, i) => i);

  const isTimeValid = (hour: number, minute: number, period: "AM" | "PM") => {
    if (!minTime) return true;
    try {
      const [minHours, minMinutes] = minTime.split(":").map(Number);
      let hour24 = hour;
      if (period === "PM" && hour !== 12) hour24 = hour + 12;
      else if (period === "AM" && hour === 12) hour24 = 0;
      if (hour24 < minHours) return false;
      if (hour24 === minHours && minute < minMinutes) return false;
      return true;
    } catch {
      return true;
    }
  };

  const isHourValid = (hour: number, period: "AM" | "PM") => {
    if (!minTime) return true;
    try {
      const [minHours] = minTime.split(":").map(Number);
      let hour24 = hour;
      if (period === "PM" && hour !== 12) hour24 = hour + 12;
      else if (period === "AM" && hour === 12) hour24 = 0;
      return hour24 >= minHours;
    } catch {
      return true;
    }
  };

  const scrollToValue = (ref: React.RefObject<HTMLDivElement>, val: number) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: val * 40,
        behavior: "smooth",
      });
    }
  };

  const handleHourChange = (hour: number) => {
    setHours(hour);
    onChange(formatTimeForForm(hour, minutes, period));
    setTimeout(
      () => scrollToValue(hourScrollRef as RefObject<HTMLDivElement>, hour - 1),
      100
    );
  };

  const handleMinuteChange = (minute: number) => {
    setMinutes(minute);
    onChange(formatTimeForForm(hours, minute, period));
    setTimeout(
      () => scrollToValue(minuteScrollRef as RefObject<HTMLDivElement>, minute),
      100
    );
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod);
    if (minTime && !isTimeValid(hours, minutes, newPeriod)) {
      const [minHours, minMinutes] = minTime.split(":").map(Number);
      const minHour12 = minHours % 12 || 12;
      const minPeriod = minHours >= 12 ? "PM" : "AM";
      if (newPeriod === minPeriod) {
        setHours(minHour12);
        setMinutes(minMinutes);
        onChange(formatTimeForForm(minHour12, minMinutes, newPeriod));
      } else {
        setHours(12);
        setMinutes(0);
        onChange(formatTimeForForm(12, 0, newPeriod));
      }
    } else {
      onChange(formatTimeForForm(hours, minutes, newPeriod));
    }
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour24 = parseInt(hours, 10);
      const mins = parseInt(minutes, 10);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 >= 12 ? "PM" : "AM";
      return `${hour12.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")} ${period}`;
    } catch {
      return timeString;
    }
  };

  return (
    <div className="w-auto p-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-2">Hour</div>
          <div
            ref={hourScrollRef}
            className="h-[200px] overflow-y-auto scrollbar-hide border rounded-md"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {generateHours().map((hour) => {
              const isDisabled = !isHourValid(hour, period);
              return (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourChange(hour)}
                  disabled={isDisabled}
                  className={cn(
                    "w-12 h-10 flex items-center justify-center text-sm rounded-md transition-colors",
                    hours === hour
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {hour.toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-2">Minute</div>
          <div
            ref={minuteScrollRef}
            className="h-[200px] overflow-y-auto scrollbar-hide border rounded-md"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {generateMinutes().map((minute) => {
              const isDisabled = !isTimeValid(hours, minute, period);
              return (
                <button
                  key={minute}
                  type="button"
                  onClick={() => handleMinuteChange(minute)}
                  disabled={isDisabled}
                  className={cn(
                    "w-12 h-10 flex items-center justify-center text-sm rounded-md transition-colors",
                    minutes === minute
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {minute.toString().padStart(2, "0")}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-2">Period</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handlePeriodChange("AM")}
              className={cn(
                "w-16 h-10 flex items-center justify-center text-sm rounded-md transition-colors",
                period === "AM"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange("PM")}
              className={cn(
                "w-16 h-10 flex items-center justify-center text-sm rounded-md transition-colors",
                period === "PM"
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              PM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimePickerField: React.FC<ITimePickerField> = ({
  name,
  placeholder = "",
  label,
  className,
  prefix = null,
  disabled = false,
  minTime,
  maxTime,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour24 = parseInt(hours, 10);
      const mins = parseInt(minutes, 10);
      const hour12 = hour24 % 12 || 12;
      const period = hour24 >= 12 ? "PM" : "AM";
      return `${hour12.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")} ${period}`;
    } catch {
      return timeString;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, formState: { errors } }) => {
        const fieldError: IFieldError = get(errors, name) as IFieldError;
        const timeValue = field.value || "";

        return (
          <div className="space-y-1.5 sm:space-y-2.5">
            {label && (
              <label className="text-primary font-semibold text-sm">
                {label}
              </label>
            )}
            <div className="space-y-1">
              <FormItem className="relative">
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                          "w-full rounded-[12px] border bg-[#F6F6F7] hover:border-main focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:border-main text-primary text-base md:text-lg h-[52px] sm:h-[58px] px-6 font-normal transition-colors text-left flex items-center justify-between cursor-pointer",
                          fieldError?.message
                            ? "text-red-500 border-red-500 focus-visible:ring-red-500 hover:border-red-500"
                            : "border-[#ECECED]",
                          prefix ? "pl-[50px] sm:pl-[55px]" : "",
                          disabled && "opacity-50 cursor-not-allowed",
                          className
                        )}
                      >
                        <span
                          className={cn(
                            timeValue ? "text-black" : "text-secondary"
                          )}
                        >
                          {timeValue
                            ? formatTimeForDisplay(timeValue)
                            : placeholder}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <TimePickerContent
                        value={timeValue}
                        onChange={field.onChange}
                        minTime={minTime}
                        maxTime={maxTime}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                {prefix && (
                  <div className="absolute flex items-center top-[13.5px] sm:top-[18px] left-[16px] sm:left-[20px] pointer-events-none z-10">
                    {prefix}
                  </div>
                )}
              </FormItem>
              {fieldError?.message && (
                <div className="pt-1 pl-3 text-xs sm:text-sm font-normal text-red-500">
                  {fieldError?.message}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default TimePickerField;

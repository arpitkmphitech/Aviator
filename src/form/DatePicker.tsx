import React, { useState, useEffect, useRef } from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { CALENDAR_ICON } from "@/lib/images";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { IDatePickerField } from "@/types/form";

const DatePicker = ({
  name,
  label,
  placeholder = "DD-MM-YYYY",
  className,
  mainClassname,
  disabledPast = true,
  disableFuture = false,
}: IDatePickerField) => {
  const { control } = useFormContext();
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const fieldValue = useWatch({ control, name });
  const prevFieldValueRef = useRef(fieldValue);

  const getDisabledDates = () => {
    if (disableFuture) {
      return { after: new Date() };
    }
    if (disabledPast) {
      return { before: new Date() };
    }
    return false;
  };

  useEffect(() => {
    if (fieldValue && fieldValue !== prevFieldValueRef.current) {
      const selectedDate = new Date(fieldValue);
      if (!isNaN(selectedDate.getTime())) {
        setDisplayMonth(selectedDate);
      }
      prevFieldValueRef.current = fieldValue;
    } else if (!fieldValue) {
      prevFieldValueRef.current = fieldValue;
    }
  }, [fieldValue]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (fieldValue) {
        const selectedDate = new Date(fieldValue);
        if (!isNaN(selectedDate.getTime())) {
          setDisplayMonth(selectedDate);
        }
      } else {
        setDisplayMonth(new Date());
      }
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name);
        return (
          <div className="space-y-1">
            <div
              className={cn(
                "border rounded-[12px] px-[18px] transition-colors duration-200 bg-white",
                fieldError ? "border-red-500" : "border-[#ECECED]",
                mainClassname
              )}
            >
              {label && (
                <label className="text-[#7F8892] font-normal text-sm md:text-base block mb-1">
                  {label}
                </label>
              )}
              <FormItem className="relative">
                <Popover onOpenChange={handleOpenChange}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "cursor-pointer flex w-full items-center justify-between text-left font-medium bg-transparent gap-3 rounded-[8px] md:text-lg sm:text-lg text-base px-0 py-[18px] min-h-[40px]",
                        !field.value && "text-[#7F8892]",
                        field.value && "text-black",
                        " transition-colors duration-200",
                        className
                      )}
                    >
                      <img
                        src={CALENDAR_ICON}
                        alt="calendar"
                        className=" opacity-70 shrink-0"
                      />
                      <span className="flex-1 text-left text-lg text-black font-normal">
                        {field.value ? (
                          format(new Date(field.value), "dd-MM-yyyy")
                        ) : (
                          <span className="text-secondary font-normal">
                            {placeholder}
                          </span>
                        )}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    sideOffset={4}
                    className="w-auto p-0 bg-white border border-gray-200 shadow-lg z-9999 rounded-[12px]"
                  >
                    <Calendar
                      disabled={getDisabledDates()}
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      month={displayMonth}
                      onMonthChange={setDisplayMonth}
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange("");
                        }
                      }}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1990}
                      toYear={new Date().getFullYear() + 5}
                      className="rounded-[12px] border-0"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>
            {fieldError?.message && (
              <div className="pl-3 text-xs sm:text-sm font-normal text-red-500">
                {fieldError?.message as string}
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default DatePicker;

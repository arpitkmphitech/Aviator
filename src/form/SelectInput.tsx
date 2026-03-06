"use client";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ISelectField } from "@/types/form";

const SelectInput = ({
  name,
  placeholder = "Select an option",
  label,
  className,
  disabled = false,
  prefix = null,
  options,
  ...other
}: ISelectField) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name);

        return (
          <div className="space-y-1.5 sm:space-y-2.5">
            {label && (
              <label className="text-primary font-semibold text-sm">
                {label}
              </label>
            )}
            <div className="space-y-1 min-w-0">
              <FormItem className="relative min-w-0">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabled}
                    {...other}
                  >
                    <SelectTrigger
                      className={cn(
                        "placeholder:text-secondary bg-[#F6F6F7]! border border-border hover:border-main placeholder:font-normal focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:border-main text-primary text-base md:text-lg placeholder:text-base sm:placeholder:text-lg min-h-[52px] sm:min-h-[58px] h-[52px]! sm:h-[58px]! py-0 px-6 rounded-[12px] font-normal transition-colors w-full min-w-0 overflow-hidden",
                        fieldError?.message
                          ? "text-red-500 focus-visible:ring-red-500 border-red-500 hover:border-red-500"
                          : "text-black disabled:text-[#969696f2] focus-visible:ring-main",
                        prefix ? "pl-[50px] sm:pl-[55px]" : "",
                        className,
                        "*:data-[slot=select-value]:text-inherit *:data-[slot=select-value]:min-w-0 *:data-[slot=select-value]:truncate",
                        "*:data-[slot=select-value][data-placeholder]:text-secondary *:data-[slot=select-value][data-placeholder]:text-base"
                      )}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem
                          key={String(option.value)}
                          value={String(option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                {prefix && (
                  <div className="absolute flex items-center top-[13.5px] sm:top-[18px] left-[16px] sm:left-[20px] pointer-events-none">
                    {prefix}
                  </div>
                )}
              </FormItem>
              {fieldError?.message && (
                <div className="pt-1 pl-3 text-xs sm:text-sm font-normal text-red-500">
                  {fieldError?.message as string}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default SelectInput;

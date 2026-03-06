import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ITextField } from "@/types/form";

const TextInput = ({
  name,
  placeholder = "",
  textarea = false,
  numeric = false,
  label,
  className,
  prefix = null,
  postfix = null,
  ...other
}: ITextField) => {
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
                  {textarea ? (
                    <Textarea
                      {...field}
                      {...other}
                      autoComplete="off"
                      id={name}
                      required
                      placeholder={placeholder}
                      className={cn(
                        "placeholder:text-secondary bg-[#F6F6F7]! border border-border hover:border-main placeholder:font-normal min-h-[150px] focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:border-main text-primary text-base md:text-lg placeholder:text-base sm:placeholder:text-lg h-[52px] sm:h-[58px] px-6 rounded-[12px] pt-3 font-normal transition-colors min-w-0",
                        fieldError?.message
                          ? "text-red-500 focus-visible:ring-red-500 border-red-500 hover:border-red-500"
                          : "text-black focus-visible:ring-main",
                        prefix ? "pl-[50px] sm:pl-[55px]" : "",
                        postfix ? "pr-[50px] sm:pr-[55px]" : "",
                        className
                      )}
                    />
                  ) : (
                    <Input
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        if (numeric) {
                          field.onChange(e.target.value.replace(/[^0-9]/g, ""));
                        } else {
                          field.onChange(e);
                        }
                      }}
                      {...(numeric && {
                        inputMode: "numeric",
                      })}
                      autoComplete="off"
                      id={name}
                      required
                      placeholder={placeholder}
                      className={cn(
                        "placeholder:text-secondary bg-[#F6F6F7]! border border-border hover:border-main placeholder:font-normal focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:border-main text-primary text-base md:text-lg placeholder:text-base sm:placeholder:text-lg h-[52px] sm:h-[58px] px-6 rounded-[12px] font-normal transition-colors min-w-0",
                        fieldError?.message
                          ? "text-red-500 focus-visible:ring-red-500 border-red-500 hover:border-red-500"
                          : "text-black disabled:text-[#969696f2] focus-visible:ring-main",
                        prefix ? "pl-[50px] sm:pl-[55px]" : "",
                        postfix ? "pr-[50px] sm:pr-[55px]" : "",
                        className
                      )}
                      {...other}
                    />
                  )}
                </FormControl>
                {prefix && (
                  <div
                    className={cn(
                      "absolute flex items-center",
                      textarea
                        ? "top-[11.5px] sm:top-[14.4px] left-[16px] sm:left-[20px]"
                        : "top-[13.5px] sm:top-[18px] left-[16px] sm:left-[20px]"
                    )}
                  >
                    {prefix}
                  </div>
                )}
                {postfix && (
                  <div
                    className={cn(
                      "absolute flex items-center",
                      textarea
                        ? "top-[11.5px] sm:top-[14.4px] right-[16px] sm:right-[20px]"
                        : "top-[13.5px] sm:top-[18px] right-[16px] sm:right-[20px]"
                    )}
                  >
                    {postfix}
                  </div>
                )}
              </FormItem>
              {fieldError?.message && (
                <div className="pt-1 pl-3 text-xs sm:text-sm  font-normal text-red-500">
                  {fieldError?.message as string}
                </div>
              )}
            </div>
          </div>
        );
      }}
    ></FormField>
  );
};

export default TextInput;

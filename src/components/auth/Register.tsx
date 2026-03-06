import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import FormProvider from "@/form/FormProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchema } from "@/lib/schema";
import TextInput from "@/form/TextInput";
import PasswordField from "@/form/PasswordField";
import SelectInput from "@/form/SelectInput";
import PhoneInput from "@/form/PhoneInput";
import {
  PROFILE_ICON,
  SMS_ICON,
  LOCK_ICON,
  USER_ICON,
  LOCATION_ICON,
  COUNTRY_ICON,
  STATE_ICON,
  CITY_ICON,
  WEIGHT_ICON,
  ZIPCODE_ICON,
  CAMERA_ICON,
} from "@/lib/images";
import Button from "@/components/common/Button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { get } from "lodash";
import type { IRegisterSignUp } from "@/types/auth";
import Link from "next/link";
import ImageCustom from "../common/Image";
import { Country, State, City } from "country-state-city";
import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { useSendOtp } from "@/hooks/auth/useSendOtp";
import { IApiResponse } from "@/types/types";
import { LocationPickerField } from "../ui/location-picker-field";
import LocationPicker from "@/form/LocationPicker";
import { base64ToFile, fileToBase64 } from "@/utils/helper";

const countryOptions = Country.getAllCountries().map((c) => ({
  value: c.name,
  label: c.name,
  isoCode: c.isoCode,
}));

const Register = () => {
  const router = useRouter();
  const { sendOtp, isPending } = useSendOtp();

  const methods = useForm<IRegisterSignUp>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cCode: "",
      flag: "",
      address: "",
      weight: "",
      zipcode: "",
      country: "",
      state: "",
      city: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      profileImage: null as File | null,
    },
    mode: "onTouched",
    resolver: yupResolver(
      RegisterSchema
    ) as unknown as Resolver<IRegisterSignUp>,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const countryCode = watch("country");
  const stateCode = watch("state");
  const profileImage = watch("profileImage");
  const profileImageError = get(errors, "profileImage");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [display, setDisplay] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  useEffect(() => {
    if (!profileImage || !(profileImage instanceof File)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profileImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  const handleProfileImageClick = () => fileInputRef.current?.click();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setValue("profileImage", file, { shouldValidate: true });
    }
    e.target.value = "";
  };

  const stateOptions = useMemo(() => {
    if (!countryCode) return [];
    const selectedCountry = countryOptions.find(
      (c) => c.isoCode === countryCode || c.value === countryCode
    );
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode).map((s) => ({
      value: s.name,
      label: s.name,
      isoCode: s.isoCode,
    }));
  }, [countryCode, countryOptions]);

  const cityOptions = useMemo(() => {
    if (!countryCode || !stateCode) return [];
    const selectedCountry = countryOptions.find(
      (c) => c.isoCode === countryCode || c.value === countryCode
    );
    if (!selectedCountry) return [];
    const selectedState = stateOptions.find(
      (s) => s.isoCode === stateCode || s.value === stateCode
    );
    if (!selectedState) return [];
    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode
    ).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [countryCode, stateCode]);

  useEffect(() => {
    setValue("state", "");
    setValue("city", "");
  }, [countryCode, setValue]);

  useEffect(() => {
    setValue("city", "");
  }, [stateCode, setValue]);

  const onSubmit = async (_values: IRegisterSignUp) => {
    let imagesBase64: string | null = null;
    if (_values.profileImage) {
      imagesBase64 = await fileToBase64(_values.profileImage as File);
      sessionStorage.setItem(
        "userData",
        JSON.stringify({ ..._values, profileImage: imagesBase64 })
      );
    }
    sendOtp(
      { email: _values.email, name: _values.name || "" },
      {
        onSuccess: (data: IApiResponse) => {
          router.push("/register-verify-otp");
        },
      }
    );
    // router.push("/register-verify-otp");
  };

  // const onSubmit = async (_values: IRegisterSignUp) => {
  //   const dataToStore = { ..._values, profileImage: null as string | null };
  //   // if (_values.profileImage && _values.profileImage instanceof File) {
  //   //   dataToStore.profileImage = await new Promise<string>((resolve, reject) => {
  //   //     const reader = new FileReader();
  //   //     reader.onload = () => resolve(reader.result as string);
  //   //     reader.onerror = reject;
  //   //     reader.readAsDataURL(_values.profileImage!);
  //   //   });
  //   // }
  //   sessionStorage.setItem("userData", JSON.stringify(dataToStore));
  // };

  return (
    <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
      <div className="px-5 sm:px-5 md:px-8 lg:px-10 py-14 flex items-center relative">
        <div className="max-w-[513px] space-y-[30px] w-full mx-auto flex flex-col">
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
          >
            <div className="flex flex-col items-center justify-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleProfileImageChange}
              />
              <button
                type="button"
                onClick={handleProfileImageClick}
                className="cursor-pointer relative sm:size-[140px] size-[114px] rounded-full overflow-visible bg-transparent focus:outline-none"
              >
                <span className="relative block w-full h-full rounded-full overflow-hidden bg-[#F6F6F7]">
                  {previewUrl ? (
                    <ImageCustom
                      src={previewUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageCustom
                      src={PROFILE_ICON}
                      alt="Add profile photo"
                      fill
                      className="object-contain"
                    />
                  )}
                </span>
                {!previewUrl && (
                  <span
                    className="absolute bottom-1 right-1 flex items-center justify-center shrink-0"
                    aria-hidden
                  >
                    <ImageCustom
                      src={CAMERA_ICON}
                      alt="CAMERA_ICON"
                      className="size-5 sm:size-[34px]"
                    />
                  </span>
                )}
              </button>
              {profileImageError?.message && (
                <p className="text-xs sm:text-sm font-normal text-red-500 text-center">
                  {String(profileImageError.message)}
                </p>
              )}
            </div>
            <div className="text-center mt-5">
              <p className="text-black text-2xl md:text-3xl leading-[45px] font-semibold">
                Sign Up
              </p>
              <p className="text-secondary text-base md:text-lg sm:text-lg font-normal">
                Enter your details below to continue
              </p>
            </div>
            <div className="space-y-4 mt-[30px]">
              <TextInput
                name="name"
                placeholder="Enter full name"
                prefix={<img src={USER_ICON} alt="USER_ICON" />}
              />
              <TextInput
                name="email"
                placeholder="Enter email"
                prefix={<img src={SMS_ICON} alt="SMS_ICON" />}
              />
              <PhoneInput
                name="phone"
                name1="cCode"
                name2="flag"
                defaultCountry="IN"
                placeholder="Enter mobile number"
              />
              <TextInput
                numeric
                name="weight"
                placeholder="Enter body weight (kg)"
                prefix={<img src={WEIGHT_ICON} alt="WEIGHT_ICON" />}
              />
              <LocationPicker
                name="address"
                placeholder="Enter address"
                // label="Address"
                prefix={<img src={LOCATION_ICON} alt="LOCATION_ICON" />}
                countryRestriction={["in"]}
              />
              {/* <TextInput
                name="address"
                placeholder="Enter address"
                prefix={<img src={LOCATION_ICON} alt="LOCATION_ICON" />}
              /> */}
              <TextInput
                numeric
                name="zipcode"
                placeholder="Enter postal code"
                prefix={<img src={ZIPCODE_ICON} alt="ZIPCODE_ICON" />}
              />
              <SelectInput
                name="country"
                placeholder="Select country"
                options={countryOptions}
                prefix={<img src={COUNTRY_ICON} alt="COUNTRY_ICON" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectInput
                  name="state"
                  placeholder="Select state"
                  options={stateOptions}
                  disabled={!countryCode}
                  prefix={<img src={STATE_ICON} alt="STATE_ICON" />}
                />
                <SelectInput
                  name="city"
                  placeholder="Select city"
                  options={cityOptions}
                  disabled={!stateCode}
                  prefix={<img src={CITY_ICON} alt="CITY_ICON" />}
                />
              </div>
              <PasswordField
                name="password"
                placeholder="Enter new password"
                prefix={<img src={LOCK_ICON} alt="LOCK_ICON" />}
              />
              <PasswordField
                name="confirmPassword"
                placeholder="Confirm new password"
                prefix={<img src={LOCK_ICON} alt="LOCK_ICON" />}
              />
              <FormField
                control={methods.control}
                name="agreeToTerms"
                render={({ field, formState: { errors } }) => {
                  const agreeError = get(errors, "agreeToTerms");
                  return (
                    <FormItem className="flex flex-row items-start gap-3 space-y-0 pt-1.5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="size-5 rounded-[4px] border-[#d4d4d8] data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5"
                        />
                      </FormControl>
                      <div className="space-y-1">
                        <div className="text-sm leading-[27px] text-secondary font-normal">
                          I agree to{" "}
                          <Link
                            href="#"
                            className="text-black font-medium underline underline-offset-2 hover:opacity-90"
                          >
                            Privacy Policy
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="#"
                            className="text-black font-medium underline underline-offset-2 hover:opacity-90"
                          >
                            Terms &amp; Conditions
                          </Link>
                        </div>
                        {agreeError?.message && (
                          <p className="text-xs sm:text-sm font-normal text-red-500">
                            {agreeError.message as string}
                          </p>
                        )}
                      </div>
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-white sm:text-lg text-base font-medium rounded-[14px] mt-10"
              loader={isPending}
              disabled={isPending}
            >
              Register
            </Button>
            <div className="text-center mt-5">
              <span className="text-lg font-normal text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">
                  Login
                </Link>
              </span>
            </div>
          </FormProvider>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Register;

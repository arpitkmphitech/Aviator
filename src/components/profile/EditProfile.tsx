"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import FormProvider from "@/form/FormProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditProfileSchema } from "@/lib/schema";
import TextInput from "@/form/TextInput";
import SelectInput from "@/form/SelectInput";
import PhoneInput from "@/form/PhoneInput";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/images";
import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import { Country, State, City } from "country-state-city";
import { useMemo, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IEditProfile } from "@/types/auth";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";

const countryOptions = Country.getAllCountries().map((c) => {
  return {
    value: c.name,
    label: c.name,
    isoCode: c.isoCode,
  };
});

const EditProfile = () => {
  const router = useRouter();
  const { user } = useUser();
  const { t } = useTranslation("profile");
  const methods = useForm<IEditProfile>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cCode: "",
      flag: "",
      address: "",
      weight: "",
      postCode: "",
      country: "",
      state: "",
      city: "",
      profile: null as File | null,
    },
    mode: "onTouched",
    resolver: yupResolver(
      EditProfileSchema
    ) as unknown as Resolver<IEditProfile>,
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  const countryCode = watch("country");
  const stateCode = watch("state");
  const cityCode = watch("city");
  const profile = watch("profile");
  const profileImageError = get(errors, "profile");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateProfile, isPending } = useUpdateProfile();

  useEffect(() => {
    if (!profile || !(profile instanceof File)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profile]);

  useEffect(() => {
    if (user) {
      reset({
        name: watch("name") ? watch("name") : user?.name || "",
        email: watch("email") ? watch("email") : user?.email || "",
        phone: watch("phone") ? watch("phone") : user?.phone || "",
        cCode: watch("cCode") ? watch("cCode") : user?.cCode || "",
        flag: watch("flag") ? watch("flag") : user?.flag || "",
        address: watch("address") ? watch("address") : user?.address || "",
        weight: watch("weight") ? watch("weight") : user?.weight || "",
        postCode: watch("postCode") ? watch("postCode") : user?.postCode || "",
        country: countryCode ? countryCode : user?.country || "",
        state: stateCode ? stateCode : user?.state || "",
        city: cityCode ? cityCode : user?.city || "",
        profile: watch("profile") instanceof File ? watch("profile") : null,
      });
      setPreviewUrl(
        profile instanceof File
          ? null
          : typeof user?.profile === "string"
            ? user.profile
            : null
      );
    }
  }, [user, reset, countryCode, stateCode, cityCode]);

  const handleProfileImageClick = () => fileInputRef.current?.click();

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setValue("profile", file, { shouldValidate: true });
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
      value: s.name, // 👈 store state name
      label: s.name,
      isoCode: s.isoCode,
    }));
  }, [countryCode]);

  const cityOptions = useMemo(() => {
    if (!countryCode || !stateCode) return [];

    const selectedCountry = countryOptions.find(
      (c) => c.isoCode === countryCode || c.value === countryCode
    );

    if (!selectedCountry) return [];

    const states = State.getStatesOfCountry(selectedCountry.isoCode);

    const selectedState = states.find(
      (s) => s.name === stateCode || s.isoCode === stateCode
    );

    if (!selectedState) return [];

    return City.getCitiesOfState(
      selectedCountry.isoCode,
      selectedState.isoCode
    ).map((city) => ({
      value: city.name,
      label: city.name,
    }));
  }, [countryCode, stateCode, countryOptions]);

  const onSubmit = (_values: IEditProfile) => {
    const { email, profile, postCode, cCode, flag, ...rest } = _values;
    updateProfile(
      {
        ...(profile instanceof File && { profile: profile }),
        postCode: postCode,
        cCode,
        flag,
        ...rest,
      },
      {
        onSuccess: () => {
          router.push("/profile/my-profile");
        },
      }
    );
  };

  return (
    <div>
      <FormProvider
        methods={methods}
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full"
      >
        <div className="bg-white rounded-[12px] border border-[#ECECED] p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
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
                className="cursor-pointer relative size-[100px] rounded-full overflow-hidden bg-[#F6F6F7] focus:outline-none shrink-0"
              >
                {previewUrl ? (
                  <ImageCustom
                    src={previewUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageCustom
                    src={DEFAULT_PROFILE_IMAGE}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                )}
              </button>
              <div>
                <button
                  type="button"
                  onClick={handleProfileImageClick}
                  className="text-black font-normal text-base underline underline-offset-2 hover:opacity-80"
                >
                  {t("changePhoto")}
                </button>
                {profileImageError?.message && (
                  <p className="text-xs font-normal text-red-500 mt-1">
                    {String(profileImageError.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TextInput name="name" placeholder={t("enterFullName")} />
              <TextInput
                name="email"
                placeholder={t("enterEmail")}
                disabled={true}
              />
              <PhoneInput
                name="phone"
                name1="cCode"
                name2="flag"
                defaultCountry={user?.flag ?? "IN"}
                placeholder={t("enterMobileNumber")}
              />
              <TextInput
                numeric
                name="weight"
                placeholder={t("enterBodyWeight")}
              />
              <TextInput name="address" placeholder={t("enterAddress")} />
              <TextInput
                numeric
                name="postCode"
                placeholder={t("enterPostalCode")}
              />
              <div className="sm:col-span-2 col-span-1">
                <SelectInput
                  name="country"
                  placeholder={t("selectCountry")}
                  options={countryOptions}
                />
              </div>
              <SelectInput
                name="state"
                placeholder={t("selectState")}
                options={stateOptions}
                disabled={!countryCode}
              />
              <SelectInput
                name="city"
                placeholder={t("enterCity")}
                options={cityOptions}
                disabled={!stateCode}
              />
            </div>
            {/* <SelectInput
              name="country"
              placeholder={t("selectCountry")}
              options={countryOptions}
            /> */}
          </div>
        </div>
        <div className="flex justify-center items-center mt-[49px] gap-3.5">
          <Button
            type="button"
            className="bg-[#ECECED] text-[#7F8892] w-[300px]"
            onClick={() => router.push("/profile/my-profile")}
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            className="w-[300px]"
            disabled={isPending}
            loader={isPending}
          >
            {t("update")}
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};

export default EditProfile;

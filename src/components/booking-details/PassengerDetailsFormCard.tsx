"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { get } from "lodash";
import ImageCustom from "@/components/common/Image";
import TextInput from "@/form/TextInput";
import SelectInput from "@/form/SelectInput";
import { GENDER_OPTIONS } from "@/lib/statics";
import {
  DEFAULT_PROFILE_IMAGE,
  DEFAULT_USER_ICON,
  GENDER_ICON,
  LIST_ICON,
  USER_PROFILE_ICON,
  WEIGHT_PURPLE_ICON,
} from "@/lib/images";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type PassengerDetailsFormCardProps = {
  index: number;
  fieldPrefix: string;
  className?: string;
  isWishlist?: boolean;
};

export function PassengerDetailsFormCard({
  index,
  fieldPrefix,
  className,
  isWishlist = false,
}: PassengerDetailsFormCardProps) {
  const { t } = useTranslation("home");
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const profileImageError = get(errors, `${fieldPrefix}.profileImage`) as
    | { message?: string }
    | undefined;
  const profileImage = watch(`${fieldPrefix}.profileImage`);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profileImage) {
      setPreviewUrl(null);
      return;
    }
    if (typeof profileImage === "string") {
      setPreviewUrl(profileImage);
      return;
    }
    if (profileImage instanceof File) {
      const url = URL.createObjectURL(profileImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [profileImage]);

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setValue(`${fieldPrefix}.profileImage`, file, { shouldValidate: true });
    }
    e.target.value = "";
  };

  const displaySrc =
    previewUrl ??
    (typeof profileImage === "string" ? profileImage : null) ??
    DEFAULT_USER_ICON;
  const genderOptions = GENDER_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div
      className={cn(
        "w-full min-w-0 bg-white rounded-xl shadow-7xl p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4 border-b border-[#ECECED] pb-3.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={handleImageClick}
          className={`cursor-pointer relative w-[34px] h-[34px] rounded-full overflow-hidden bg-[#F6F6F7] focus:outline-none shrink-0 hover:opacity-90 transition-opacity ${profileImageError ? "ring-2 ring-red-500" : ""}`}
        >
          <ImageCustom
            src={displaySrc}
            alt={`Passenger ${index + 1} profile`}
            fill
            className="w-full! h-full! object-cover"
          />
        </button>
        <div>
          <h2 className="text-[#1F1F1F] sm:text-lg text-base font-normal">
            {t("passenger")}: {index + 1}
          </h2>
          {profileImageError?.message && (
            <p className="text-xs text-red-500 mt-0.5">
              {profileImageError.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0 *:min-w-0">
        <TextInput
          placeholder={t("enterName")}
          name={`${fieldPrefix}.name`}
          prefix={
            <ImageCustom src={USER_PROFILE_ICON} alt="USER_PROFILE_ICON" />
          }
          className={cn(isWishlist ? "bg-white!" : "")}
        />

        <SelectInput
          options={genderOptions}
          placeholder={t("selectGender")}
          name={`${fieldPrefix}.gender`}
          prefix={<ImageCustom src={GENDER_ICON} alt="GENDER_ICON" />}
          className={cn(isWishlist ? "bg-white!" : "")}
        />

        <TextInput
          numeric
          placeholder={t("enterAge")}
          name={`${fieldPrefix}.age`}
          prefix={<ImageCustom src={LIST_ICON} alt="LIST_ICON" />}
          className={cn(isWishlist ? "bg-white!" : "")}
        />

        <TextInput
          numeric
          placeholder={t("enterWeight")}
          name={`${fieldPrefix}.weight`}
          prefix={
            <ImageCustom src={WEIGHT_PURPLE_ICON} alt="WEIGHT_PURPLE_ICON" />
          }
          className={cn(isWishlist ? "bg-white!" : "")}
        />
      </div>
    </div>
  );
}

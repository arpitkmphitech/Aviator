"use client";

import ImageCustom from "@/components/common/Image";
import { countries } from "@/data/country";
import { useUser } from "@/hooks/useUser";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/images";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import PageLoader from "../common/PageLoader";

const formatPhone = (value: string, format: string) => {
  const digits = value.replace(/\D/g, "");
  let i = 0;
  return format.replace(/#/g, () => digits[i++] || "");
};

const MyProfile = () => {
  const { t } = useTranslation("profile");
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px]">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border border-[#ECECED] p-6 flex flex-col gap-5">
      <ImageCustom
        alt="Profile Image"
        src={user?.profile || DEFAULT_PROFILE_IMAGE}
        className="size-[100px] rounded-full object-cover"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("fullName")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.name}
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("email")}
          </span>
          <span className="font-medium text-lg text-[#5C6268] truncate">
            {user?.email}
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("phoneNumber")}
          </span>
          <div className="flex items-center gap-2">
            {(() => {
              const country =
                countries.find((v) =>
                  user?.flag ? v.flag === user.flag : v.cCode === user?.cCode
                ) ?? null;
              const formatted =
                user?.phone && country?.format
                  ? formatPhone(user.phone, country.format)
                  : (user?.phone ?? "");
              return (
                <>
                  <ReactCountryFlag
                    svg
                    style={{ fontSize: 32 }}
                    countryCode={country?.flag ?? user?.flag ?? "IN"}
                  />
                  <span className="font-medium text-lg text-[#5C6268]">
                    +{user?.cCode} {formatted}
                  </span>
                </>
              );
            })()}
          </div>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("weight")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.weight} Kg
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("address")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.address}
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("city")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.city}
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("state")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.state}
          </span>
        </div>
        <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
          <span className="font-light text-base text-[#7F8892]">
            {t("postCode")}
          </span>
          <span className="font-medium text-lg text-[#5C6268]">
            {user?.postCode}
          </span>
        </div>
      </div>
      <div className="border-b border-[#ECECED] flex flex-col gap-2 p-3">
        <span className="font-light text-base text-[#7F8892]">
          {t("country")}
        </span>
        <span className="font-medium text-lg text-[#5C6268]">
          {user?.country}
        </span>
      </div>
    </div>
  );
};

export default MyProfile;

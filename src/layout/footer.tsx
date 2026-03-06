"use client";

import ImageCustom from "@/components/common/Image";
import {
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  MAIN_HEADER_LOGO,
  TWITTER_ICON,
} from "@/lib/images";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation("home");
  return (
    <div
      className={cn(
        "bg-white 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 py-12",
        pathname.includes("/profile") && "bg-[#F6F6F7]"
      )}
    >
      <div
        className={cn(
          "flex items-center flex-wrap gap-3 justify-between sm:pb-8 pb-4  border-b border-[#E8E8E9]",
          pathname.includes("/profile") && "border-b-0"
        )}
      >
        <ImageCustom
          src={MAIN_HEADER_LOGO}
          alt="MAIN_HEADER_LOGO"
          className="object-contain sm:w-[150px] sm:h-[50px] w-[100px] h-[35px]"
        />
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex justify-center items-center size-[40px] bg-white rounded-full">
            <ImageCustom
              src={FACEBOOK_ICON}
              alt="FACEBOOK_ICON"
              className="object-contain size-[22px]"
            />
          </div>
          <div className="flex justify-center items-center size-[40px] bg-white rounded-full">
            <ImageCustom
              src={TWITTER_ICON}
              alt="TWITTER_ICON"
              className="object-contain size-[22px]"
            />
          </div>
          <div className="flex justify-center items-center size-[40px] bg-white rounded-full">
            <ImageCustom
              src={INSTAGRAM_ICON}
              alt="INSTAGRAM_ICON"
              className="object-contain size-[22px]"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center flex-wrap justify-between sm:pt-8 pt-4 gap-3">
        <p className="sm:text-base text-sm font-normal text-[#7F8892]">
          © {new Date().getFullYear()} {t("aviateFinder")} |{" "}
          {t("allRightsReserved")}
        </p>
        <div className="sm:text-base text-sm font-normal text-[#7F8892]">
          {" "}
          <Link href="/privacy-policy"> {t("privacyPolicy")} </Link> and{" "}
          <Link href="/terms-and-conditions">
            {" "}
            {t("termsAndConditions")}{" "}
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default Footer;

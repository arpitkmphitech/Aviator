"use client";

import ImageCustom from "@/components/common/Image";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BAG_ICON,
  CLOCK_ICON,
  DOCUMENT_TEXT_ICON,
  ENDORSEMENTS_ICON,
  EXPORT_ICON,
  FLIGHT_ICON,
  LICENSE_ICON,
  LOCATION_PURPLE_ICON,
  REVIEWS_ICON,
  STAR_ICON,
} from "@/lib/images";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useGetPilotDetails from "@/hooks/home/useGetPilotDetails";
import useScrollToTop from "@/hooks/useScrollToTop";
import PageLoader from "../common/PageLoader";

export function PilotProfile() {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation("home");
  const { pilotId } = useParams<{ pilotId: string }>();
  const { pilotDetails, isLoading } = useGetPilotDetails(pilotId ?? "");

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-9">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-[30px] font-medium text-black">{t("profile")}</h1>
        </div>
        <div className="flex items-center gap-7">
          <Link href={`/chat`}>
            <Button className="w-[112px] min-h-12!">{t("chat")}</Button>
          </Link>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }}
            className="flex items-center gap-2 text-[#5C6268] sm:text-lg text-base font-normal cursor-pointer"
          >
            <ImageCustom src={EXPORT_ICON} alt="export" />
            {t("share")}
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[600px]">
          <PageLoader />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[10px] p-4 mb-[22px]">
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-between border-b border-[#98A1AB4D] pb-[22px] mb-[22px]">
                <div className="flex items-center gap-4">
                  <ImageCustom
                    alt={pilotDetails.name}
                    src={pilotDetails.profile}
                    className="size-[78px] rounded-full"
                  />

                  <div className="flex flex-col gap-1.5">
                    <p className="font-medium text-[#2C2C2C] sm:text-[22px] text-lg">
                      {pilotDetails.name}
                    </p>
                    <div className="flex items-center gap-2 text-[#6B7280] text-base">
                      <ImageCustom
                        src={LOCATION_PURPLE_ICON}
                        alt="LOCATION_PURPLE_ICON"
                      />
                      <span>{pilotDetails.address}</span>
                    </div>
                  </div>
                </div>
                <div className="w-[71px] h-[34px] bg-[#FFCC002B] rounded-[50px] flex items-center gap-1.5 px-3 py-2">
                  <ImageCustom
                    src={STAR_ICON}
                    alt="STAR_ICON"
                    className="size-4"
                  />
                  <span className="font-medium text-base text-black">
                    {pilotDetails.averageRating?.toFixed(1)}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ImageCustom
                    src={DOCUMENT_TEXT_ICON}
                    alt="DOCUMENT_TEXT_ICON"
                  />
                  <h3 className="font-light text-lg text-[#6F6F6F]">
                    {t("description")}
                  </h3>
                </div>
                <p className="text-black text-base font-light leading-relaxed">
                  {pilotDetails.description}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-[10px] p-[18px] flex flex-col">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-3.5 mb-3.5">
                <ImageCustom src={CLOCK_ICON} alt="CLOCK_ICON" />
                <h3 className="font-light text-lg text-[#6F6F6F]">
                  {t("hoursOfFlight")}
                </h3>
              </div>
              <p className="text-black text-base font-light leading-relaxed">
                {pilotDetails.totalFlightHours}
              </p>
            </div>
            <div className="bg-white rounded-[10px] p-[18px] flex flex-col">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-3.5 mb-3.5">
                <ImageCustom src={BAG_ICON} alt="BAG_ICON" />
                <h3 className="font-light text-lg text-[#6F6F6F]">
                  {t("flyingExperienceYears")}
                </h3>
              </div>
              <p className="text-black text-base font-light leading-relaxed">
                {pilotDetails.experience ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-[10px] p-[18px] flex flex-col">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-3.5 mb-3.5">
                <ImageCustom src={LICENSE_ICON} alt="LICENSE_ICON" />
                <h3 className="font-light text-lg text-[#6F6F6F]">
                  {t("pilotLicense")}
                </h3>
              </div>
              <p className="text-black text-base font-light leading-relaxed">
                {pilotDetails.qualification}
              </p>
            </div>
            <div className="bg-white rounded-[10px] p-[18px] flex flex-col">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-3.5 mb-3.5">
                <ImageCustom src={ENDORSEMENTS_ICON} alt="ENDORSEMENTS_ICON" />
                <h3 className="font-light text-lg text-[#6F6F6F]">
                  {t("ratingsEndorsements")}
                </h3>
              </div>
              <p className="text-black text-base font-light leading-relaxed">
                {pilotDetails.ratingAndEndorsements?.join(", ")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href={`/home/pilot/${pilotDetails.userId}/reviews`}>
              <div className="flex items-center justify-between bg-white rounded-[10px] p-2.5">
                <div className="flex items-center gap-2.5">
                  <ImageCustom
                    src={REVIEWS_ICON}
                    alt="REVIEWS_ICON"
                    className="size-[50px]"
                  />
                  <span className="font-normal text-base text-black">
                    {t("viewAllReviews")}
                  </span>
                </div>
                <ChevronRight className="size-6 text-[#98A1AB] shrink-0" />
              </div>
            </Link>
            <Link href={`/home/pilot/${pilotDetails.userId}/availability`}>
              <div className="flex items-center justify-between bg-white rounded-[10px] p-2.5 ">
                <div className="flex items-center gap-2.5">
                  <ImageCustom
                    src={FLIGHT_ICON}
                    alt="FLIGHT_ICON"
                    className="size-[50px]"
                  />
                  <span className="font-normal text-base text-black">
                    {t("viewPilotAvailability")}
                  </span>
                </div>
                <ChevronRight className="size-6 text-[#98A1AB] shrink-0" />
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

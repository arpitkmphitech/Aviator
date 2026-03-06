"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import { ArrowLeft } from "lucide-react";
import ImageCustom from "@/components/common/Image";
import type { IFlightAvailabilityItem } from "@/types/home";
import { AIRPLANE_ICON } from "@/lib/images";
import Button from "@/components/common/Button";
import { useTranslation } from "react-i18next";

const ComparePage = () => {
  const router = useRouter();
  const { t } = useTranslation("home");
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<IFlightAvailabilityItem[] | null>(
    null
  );

  useEffect(() => {
    const dataParam = searchParams.get("data");
    if (!dataParam) {
      router.replace("/home");
      return;
    }
    try {
      const base64 = dataParam.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      const parsed = JSON.parse(atob(padded)) as IFlightAvailabilityItem[];
      if (Array.isArray(parsed) && parsed.length >= 2) {
        setFlights(parsed.slice(0, 2));
      } else {
        router.replace("/home");
      }
    } catch {
      router.replace("/home");
    }
  }, [searchParams, router]);

  if (!flights || flights.length < 2) {
    return null;
  }

  const [flight1, flight2] = flights;

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-[30px] font-medium text-black">
            {t("flightComparison")}
          </h1>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row w-full bg-white rounded-[20px] overflow-hidden">
        <div className="flex-1 p-7">
          <div className="flex justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <ImageCustom
                src={flight1.airCraftData?.safetyImage}
                alt={flight1.airCraftData?.craftModel}
                className="size-[46px] rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-normal text-[#98A1AB]">
                  {t("flight")}
                </p>
                <h3 className="font-semibold text-base text-black">
                  {flight1.airCraftData?.craftModel}
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-end text-primary">
              <span className="font-bold text-[20px]">
                €{flight1.perPersonAmount.toFixed(2)}
              </span>
              <span className="font-medium text-sm">{t("perPerson")}</span>
            </div>
          </div>
          <div className="flex flex-col sm:hidden gap-0 mb-3">
            <div>
              <p className="text-sm font-normal text-[#98A1AB]">{t("from")}</p>
              <p className="font-semibold text-base text-black wrap-break-word">
                {flight1.route?.[0]?.mainLocation ?? ""}
              </p>
            </div>
            <div className="flex items-center gap-2 py-1">
              <div className="flex flex-col items-center shrink-0">
                <ImageCustom
                  src={AIRPLANE_ICON}
                  alt="airplane"
                  className="shrink-0 rotate-90"
                />
                <div className="w-px flex-1 min-h-7 border-l border-dashed border-[#DBE3EB]" />
                <div className="size-[5px] rounded-full bg-[#DBE3EB]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-normal text-[#98A1AB]">{t("to")}</p>
              <p className="font-semibold text-base text-black wrap-break-word">
                {flight1.route?.[flight1.route.length - 1]?.mainLocation ?? ""}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center w-full gap-2 min-w-0 border-b border-[#F5F5F5] pb-3 mb-3">
            <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
              <p className="text-sm font-normal text-[#98A1AB]">{t("from")}</p>
              <p className="font-semibold text-base text-black truncate">
                {flight1.route?.[0]?.mainLocation ?? ""}
              </p>
            </div>
            <div className="flex-1 flex items-center gap-1 px-1 min-w-0">
              <ImageCustom
                src={AIRPLANE_ICON}
                alt="airplane"
                className="shrink-0"
              />
              <div className="flex-1 min-w-[12px] border-t border-dashed border-[#DBE3EB]" />
              <div className="size-[5px] rounded-full bg-[#DBE3EB] shrink-0" />
            </div>
            <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
              <p className="text-sm font-normal text-[#98A1AB]">{t("to")}</p>
              <p className="font-semibold text-base text-black truncate">
                {flight1.route?.[flight1.route.length - 1]?.mainLocation ?? ""}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start md:items-end flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-[#98A1AB]">
                {t("dateAndTime")}
              </p>
              <p className="font-medium text-base text-black truncate">
                {moment(flight1.departureStartTime).format("MMM D, YYYY HH:mm")}
              </p>
            </div>
            <Button
              className="w-[146px] min-h-11!"
              onClick={() => router.push(`/home/${flight1.availabilityId}`)}
            >
              {t("select")}
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col justify-between py-0 w-full sm:w-px min-h-px sm:min-h-[200px]">
          <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#F6F6F7] rounded-full" />
          <div className="h-px sm:h-full w-full sm:w-px border-t sm:border-t-0 sm:border-l-2 border-dashed border-gray-200" />
          <div className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#F6F6F7] rounded-full" />
        </div>

        <div className="flex-1 p-7">
          <div className="flex justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <ImageCustom
                src={flight2.airCraftData?.safetyImage}
                alt={flight2.airCraftData?.craftModel}
                className="size-[46px] rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-normal text-[#98A1AB]">
                  {t("flight")}
                </p>
                <h3 className="font-semibold text-base text-black">
                  {flight2.airCraftData?.craftModel}
                </h3>
              </div>
            </div>
            <div className="flex flex-col items-end text-primary">
              <span className="font-bold text-[20px]">
                €{flight2.perPersonAmount.toFixed(2)}
              </span>
              <span className="font-medium text-sm">{t("perPerson")}</span>
            </div>
          </div>
          <div className="flex flex-col sm:hidden gap-0 mb-3">
            <div>
              <p className="text-sm font-normal text-[#98A1AB]">{t("from")}</p>
              <p className="font-semibold text-base text-black wrap-break-word">
                {flight2.route?.[0]?.mainLocation ?? ""}
              </p>
            </div>
            <div className="flex items-center gap-2 py-1">
              <div className="flex flex-col items-center shrink-0">
                <ImageCustom
                  src={AIRPLANE_ICON}
                  alt="airplane"
                  className="shrink-0 rotate-90"
                />
                <div className="w-px flex-1 min-h-7 border-l border-dashed border-[#DBE3EB]" />
                <div className="size-[5px] rounded-full bg-[#DBE3EB]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-normal text-[#98A1AB]">{t("to")}</p>
              <p className="font-semibold text-base text-black wrap-break-word">
                {flight2.route?.[flight2.route.length - 1]?.mainLocation ?? ""}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center w-full gap-2 min-w-0 border-b border-[#F5F5F5] pb-3 mb-3">
            <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
              <p className="text-sm font-normal text-[#98A1AB]">{t("from")}</p>
              <p className="font-semibold text-base text-black truncate">
                {flight2.route?.[0]?.mainLocation ?? ""}
              </p>
            </div>
            <div className="flex-1 flex items-center gap-1 px-1 min-w-0">
              <ImageCustom
                src={AIRPLANE_ICON}
                alt="airplane"
                className="shrink-0"
              />
              <div className="flex-1 min-w-[12px] border-t border-dashed border-[#DBE3EB]" />
              <div className="size-[5px] rounded-full bg-[#DBE3EB] shrink-0" />
            </div>
            <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
              <p className="text-sm font-normal text-[#98A1AB]">{t("to")}</p>
              <p className="font-semibold text-base text-black truncate">
                {flight2.route?.[flight2.route.length - 1]?.mainLocation ?? ""}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-start md:items-end flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-normal text-[#98A1AB]">
                {t("dateAndTime")}
              </p>
              <p className="font-medium text-base text-black truncate">
                {moment(flight2.departureStartTime).format("MMM D, YYYY HH:mm")}
              </p>
            </div>
            <Button
              className="w-[146px] min-h-11!"
              onClick={() => router.push(`/home/${flight2.availabilityId}`)}
            >
              {t("select")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RatePilotModal from "../modals/RatePilotModal";
import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import { BookingRouteMap } from "@/components/BookingRouteMap";
import { AIRPLANE_ICON, PLANE1, LOCATION_PURPLE_ICON } from "@/lib/images";
import { useTranslation } from "react-i18next";
import { useBidBookingDetail } from "@/hooks/wishlist/useBidBookingDetail";
import { useBidRequestStatus } from "@/hooks/wishlist/useBidRequestStatus";
import { convertMinutesToHours, routePointDisplay } from "@/lib/utils";
import moment from "moment";
import CongratulationsModal from "@/modal/CongratulationsModal";
import LuggageDisplay from "@/components/common/LuggageDisplay";

const WishlistBookingConfirmation = () => {
  const router = useRouter();
  const params = useParams();
  const wishlistId = (params?.wishlistId as string) ?? "";
  const proposalId = (params?.proposalId as string) ?? "";
  const { t } = useTranslation("wishlist");
  const { bidBookingDetail, isLoading: isLoadingBidBookingDetail } =
    useBidBookingDetail({ bidId: proposalId });
  const { updateBidRequestStatus, isPending: isPaymentProcessing } =
    useBidRequestStatus();

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [congratulationsOpen, setCongratulationsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = new URLSearchParams(window.location.search);
    if (search.get("isSuccess") === "true") {
      setCongratulationsOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const route = bidBookingDetail?.flightDetails?.route;
  const fromDisplay = route?.length ? routePointDisplay(route[0]) : "";
  const toDisplay = route?.length
    ? routePointDisplay(route[route.length - 1])
    : "";
  const from = fromDisplay || (bidBookingDetail?.flightDetails?.from ?? "");
  const to = toDisplay || (bidBookingDetail?.flightDetails?.to ?? "");

  return (
    <div className="min-h-full bg-[#F8F8FA] pb-[60px]">
      <div className="2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-[#1F1F1F]"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-[26px] md:text-[30px] font-medium text-black">
            {t("bookingConfirmation")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-5 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[20px] shadow-[0px_7px_4.6px_0px_#7854B814] p-5">
              <div className="flex flex-col border-b border-[#F3F4F6]">
                <div className="flex items-start justify-between border-b border-[#F5F5F5] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <ImageCustom
                      src={bidBookingDetail?.pilotDetails?.profile}
                      alt={bidBookingDetail?.pilotDetails?.name}
                      className="size-[46px] rounded-full"
                    />
                    <div>
                      <p className="text-xs font-normal text-[#98A1AB]">
                        {t("pilotName")}
                      </p>
                      <p className="text-base font-semibold text-black">
                        {bidBookingDetail?.pilotDetails?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-[30px]">
                    <div>
                      <p className="text-xs font-normal text-[#98A1AB]">
                        {t("flightHours")}
                      </p>
                      <p className="text-base font-medium text-black">
                        {bidBookingDetail?.pilotDetails?.flightHours}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-normal text-[#98A1AB]">
                        {t("experienceYears")}
                      </p>
                      <p className="text-base font-medium text-black">
                        {bidBookingDetail?.pilotDetails?.experience}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between border-b border-[#F5F5F5] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <ImageCustom
                      src={bidBookingDetail?.craftDetails?.safetyImage}
                      alt={bidBookingDetail?.craftDetails?.craftModel}
                      className="size-[46px] rounded-full"
                    />
                    <div>
                      <p className="text-xs font-normal text-[#98A1AB]">
                        {t("aircraftName")}
                      </p>
                      <p className="text-base font-semibold text-black">
                        {bidBookingDetail?.craftDetails?.craftModel}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center w-full gap-2 sm:gap-10 min-w-0 border-b border-[#F5F5F5] pb-4 mb-4">
                  <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
                    <p className="text-sm font-normal text-[#98A1AB]">
                      {t("departureFrom")}
                    </p>
                    <p className="font-semibold text-base text-black truncate">
                      {from}
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
                    <p className="text-sm font-normal text-[#98A1AB]">
                      {t("toDestination")}
                    </p>
                    <p className="font-semibold text-base text-black truncate">
                      {to}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pb-3">
                  <div>
                    <p className="font-medium text-sm text-[#98A1AB]">
                      {t("dateAndTime")}
                    </p>
                    <p className="mt-1 text-black font-medium text-base">
                      {moment(
                        bidBookingDetail?.flightDetails?.departureStartTime
                      )
                        .local()
                        .format("MMM DD, YYYY HH:mm")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#98A1AB]">
                      {t("passengers")}
                    </p>
                    <p className="mt-1 text-black font-medium text-base">
                      {bidBookingDetail?.flightDetails?.totalPassengers}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#98A1AB]">
                      {t("flightType")}
                    </p>
                    <p className="mt-1 text-black font-medium text-base capitalize">
                      {bidBookingDetail?.flightDetails?.tourType}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#98A1AB]">
                      {t("flightDuration")}
                    </p>
                    <p className="mt-1 text-black font-medium text-base">
                      {convertMinutesToHours(
                        Number(bidBookingDetail?.flightDetails?.flightDuration)
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-t border-[#F3F4F6] pt-4">
                <div>
                  <p className="font-medium text-sm text-[#98A1AB]">
                    {t("luggage")}
                  </p>
                  <p className="mt-1 text-black font-medium text-base">
                    <LuggageDisplay
                      luggageType={bidBookingDetail?.flightDetails?.luggageType}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] shadow-[0px_7px_4.6px_0px_#7854B814] p-5">
              <div className="flex justify-between items-center border-b border-[#F5F5F5] pb-3 mb-3">
                <p className="text-base font-medium text-black">
                  {t("totalPassengers")}
                </p>
                <span className="text-lg font-medium text-primary">
                  {bidBookingDetail?.flightDetails?.totalPassengers}
                </span>
              </div>

              <div className="space-y-3">
                {bidBookingDetail?.flightDetails?.passengerInfo?.map(
                  (passenger: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between mb-3 pb-3 border-b border-[#F5F5F5] last:mb-0 last:pb-0 last:border-b-0"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <ImageCustom
                          src={passenger.profile}
                          alt={passenger.name}
                          className="size-10 rounded-full object-cover"
                        />
                        <div className="w-full flex flex-col gap-1 text-xs">
                          <p className="font-medium text-black">
                            {t("passenger")} {index + 1}
                          </p>
                          <p className="text-sm md:text-base font-medium text-[#98A1AB]">
                            {t("name")}:{" "}
                            <span className="font-medium text-primary">
                              {passenger.name}
                            </span>
                          </p>
                          <div className="w-full flex justify-between items-center">
                            <p className="text-sm md:text-base font-medium text-[#98A1AB]">
                              {t("age")}:{" "}
                              <span className="font-medium text-black">
                                {passenger.age}
                              </span>
                            </p>
                            <p className="text-sm md:text-base font-medium text-[#98A1AB]">
                              {t("weight")}:{" "}
                              <span className="font-medium text-black">
                                {passenger.passengersWeight}{" "}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-[20px] shadow-[0px_7px_4.6px_0px_#7854B814] p-5">
              <div className="flex items-center gap-3 border-b border-[#F5F5F5] pb-3 mb-3">
                <ImageCustom
                  src={LOCATION_PURPLE_ICON}
                  alt="location"
                  className="size-5 md:size-6"
                />
                <p className="text-base font-medium text-black">
                  {t("meetingPoint")}
                </p>
              </div>
              <div>
                <p className="text-base font-medium text-[#98A1AB]">
                  {bidBookingDetail?.flightDetails?.route[0]?.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center mb-2.5">
                <p className="text-base font-medium text-black">
                  {t("totalRoutes")}
                </p>
              </div>
              <BookingRouteMap
                activityType={bidBookingDetail?.flightDetails?.tourType}
                routeCoordinates={bidBookingDetail?.flightDetails?.route}
              />
            </div>

            <div className="bg-white rounded-[20px] shadow-[0px_7px_4.6px_0px_#7854B814] p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[22px] font-semibold text-primary">
                    €{bidBookingDetail?.perPersonAmount}
                  </p>
                  <p className="text-sm font-normal text-[#98A1AB] mt-1">
                    {t("includePlatformFeeOf")}{" "}
                    <span className="text-black">12%</span>
                  </p>
                </div>
                <div className="text-primary text-lfg font-medium">
                  {t("perPerson")}
                </div>
              </div>
            </div>
            <Button
              disabled={isPaymentProcessing}
              loader={isPaymentProcessing}
              onClick={() => {
                const formData = new FormData();
                formData.append("bidId", proposalId);
                formData.append("status", "Accepted");
                formData.append("from", "web");
                const successPath =
                  wishlistId && proposalId
                    ? `/wishlist/${wishlistId}/confirm/${proposalId}?isSuccess=true`
                    : wishlistId
                      ? `/wishlist/${wishlistId}?isSuccess=true`
                      : "/wishlist?isSuccess=true";
                const webUrl =
                  typeof window !== "undefined"
                    ? `${window.location.origin}${successPath}`
                    : successPath;
                formData.append("webUrl", encodeURIComponent(webUrl));

                updateBidRequestStatus(formData).then((result) => {
                  const res = result as {
                    data?: { callback?: string };
                  };
                  const data = res?.data;
                  if (data?.callback) {
                    window.location.href = data.callback;
                    return;
                  }
                  router.push(
                    wishlistId ? `/wishlist/${wishlistId}` : "/wishlist"
                  );
                });
              }}
            >
              {t("paymentProcess")}
            </Button>
          </div>
        </div>
      </div>

      <CongratulationsModal
        open={congratulationsOpen}
        setOpen={setCongratulationsOpen}
        onOk={() => router.push("/wishlist")}
      />

      <RatePilotModal
        open={isRateModalOpen}
        onOpenChange={setIsRateModalOpen}
        pilotName={bidBookingDetail?.pilotDetails?.name}
        pilotProfileImage={bidBookingDetail?.pilotDetails?.profile}
        onSubmit={(rating, feedback) => {
          // Optional: call API to submit rating/feedback
        }}
      />
    </div>
  );
};

export default WishlistBookingConfirmation;

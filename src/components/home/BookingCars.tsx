import { FlightBooking } from "@/types/booking";
import ImageCustom from "../common/Image";
import { Plane, Users } from "lucide-react";
import { AIRPLANE_ICON, LAMP_ICON } from "@/lib/images";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Button from "../common/Button";
import BookingStatusConfirmModal from "@/modal/BookingStatusConfirmModal";
import useUpdateBookingStatus from "@/hooks/home/useUpdateBookingStatus";

export function BookingCard({ booking }: { booking: FlightBooking }) {
  const router = useRouter();
  const { t } = useTranslation("home");
  const { t: st } = useTranslation("wishlist");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusConsent, setStatusConsent] = useState<"yes" | "no" | null>(null);
  const { updateBookingStatus, isPending: isStatusPending } =
    useUpdateBookingStatus();

  let shouldShowReviewButtons = false;
  if (booking.isFlightCompleted === null && booking.departureEndTime) {
    const endLocal = moment(booking.departureEndTime).local();
    if (endLocal.isValid()) {
      const nowLocal = moment();
      const hoursSinceEnd = nowLocal.diff(endLocal, "hours", true);
      shouldShowReviewButtons =
        endLocal.isBefore(nowLocal) && hoursSinceEnd <= 48;
    }
  }

  return (
    <article
      className="bg-white h-fit rounded-[10px] overflow-hidden shadow-7xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      onClick={() => router.push(`/my-bookings/${booking.id}`)}
    >
      <div className="relative bg-[#EEEEEE]">
        <ImageCustom
          src={booking.aircraftImage}
          alt={booking.aircraftModel}
          className="object-cover w-full h-[205px]"
          height={205}
        />
        {booking?.bookingType === "wishFlight" && (
          <div className="absolute top-2 right-2 bg-primary rounded-full size-[10px] text-xs w-fit h-fit text-white py-1 px-2.5">
            {t("wishFlight")}
          </div>
        )}
      </div>
      <div className="flex justify-between items-start gap-2 border-b border-[#ECECED] py-3 mx-4">
        <h3 className="font-semibold text-[#2C2C2C] sm:text-base text-sm">
          {booking.aircraftModel}
        </h3>
        <span className="flex items-center gap-1 text-[#6B7280] text-xs font-medium shrink-0">
          <ImageCustom src={LAMP_ICON} alt="lamp" />
          {booking.passengers}
        </span>
      </div>
      <div className="px-4 pt-3 pb-4 flex justify-between items-center">
        <div className="space-y-2.5">
          <p className="font-semibold text-[#1A1A1A] text-base sm:text-lg">
            {booking.city}
          </p>
          <p className="text-[#6B7280] text-xs font-normal">
            {booking.country}
          </p>
          <div className="flex justify-between items-center gap-2 text-[#6B7280] text-sm">
            <span className="text-xs font-medium text-[#1A1A1A]">
              {booking.time}{" "}
              <span className="text-sm font-light text-[#98A1AB]">|</span>{" "}
              {booking.date}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-xs font-semibold text-[#2C2C2C]">
            {booking.duration}
          </p>
          <div className="flex items-center justify-center">
            <ImageCustom src={AIRPLANE_ICON} alt="airplane" />
            <div className="border border-dashed border-[#DBE3EB] w-[100px] h-px "></div>
            <div className="size-[5px] rounded-full bg-[#DBE3EB]"> </div>
          </div>
          <p className="text-xs font-normal text-[#98A1AB] capitalize">
            {booking.activityType === "oneWay"
              ? st("oneWay")
              : booking.activityType}
          </p>
        </div>
      </div>
      {shouldShowReviewButtons && (
        <div className="px-4 pb-4 flex 3xl:flex-row flex-col gap-3">
          <Button
            type="button"
            className="flex-1 bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              setStatusConsent("yes");
              setStatusModalOpen(true);
            }}
          >
            {t("complete")}
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              setStatusConsent("no");
              setStatusModalOpen(true);
            }}
          >
            {t("needReview")}
          </Button>
        </div>
      )}
      <BookingStatusConfirmModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        title={
          statusConsent === "yes"
            ? t("markBookingAsComplete")
            : t("markBookingAsNeedsReview")
        }
        description={
          statusConsent === "yes"
            ? t("areYouSureYouWantToMarkThisBookingAsCompleted")
            : t("doYouWantToFlagThisBookingForReview")
        }
        isLoading={isStatusPending}
        onConfirm={async () => {
          if (!statusConsent) return;
          await updateBookingStatus({
            bookingId: booking.id,
            consent: statusConsent,
          });
          setStatusModalOpen(false);
          router.push("/my-bookings");
        }}
      />
    </article>
  );
}

"use client";

import { BookingRouteMap } from "@/components/BookingRouteMap";
import {
  BookingAircraftCard,
  BookingDescriptionCard,
  BookingFeaturesCard,
  BookingGallery,
  BookingPilotCard,
  BookingStatsCards,
  MeetingPointCard,
  PassengerDetailsCard,
} from "@/components/booking-details";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AIRPLANE_ICON,
  AIRPLANE_OUTLINE_ICON,
  DIAMOND_ICON,
  DOCUMENT_TEXT_ICON,
  EXPORT_ICON,
  FILLED_CHECK_ICON,
  GROUP_ICON,
  LAMP_ICON,
  LOCATION_PURPLE_ICON,
  PHOTOS_ICON,
  PLANE1,
  STAR_ICON,
  WEIGHT_PURPLE_ICON,
} from "@/lib/images";
import ImageCustom from "@/components/common/Image";
import type { BookingDetailsData, PassengerDetailsForm } from "@/types/booking";
import Link from "next/link";
import Button from "@/components/common/Button";
import CancelFlightReasonModal from "@/modal/CancelFlightReasonModal";
import CancelFlightConfirmModal from "@/modal/CancelFlightConfirmModal";
import BookingStatusConfirmModal from "@/modal/BookingStatusConfirmModal";
import RateFlightModal from "@/components/modals/RateFlightModal";
import useGetBookingDetails from "@/hooks/home/useGetBookingDetails";
import useCancelBooking from "@/hooks/home/useCancelBooking";
import useUpdateBookingStatus from "@/hooks/home/useUpdateBookingStatus";
import useRateFlight from "@/hooks/home/useRateFlight";
import type { IBookingDetailsResponse } from "@/types/home";
import moment from "moment";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import useScrollToTop from "@/hooks/useScrollToTop";
import PageLoader from "@/components/common/PageLoader";

function mapBookingDetailsToDisplay(
  data: IBookingDetailsResponse | null
): BookingDetailsData | null {
  if (!data) return null;

  const avail = data.availabilityDetails;
  const route = avail?.route?.[0];
  const city = route?.mainLocation ?? "";
  const country = route?.location?.split(", ").pop()?.trim() ?? "";

  const start = moment(avail?.departureStartTime);
  const durationMins = avail?.flightDuration ?? 0;
  const hours = Math.floor(durationMins / 60);
  const mins = durationMins % 60;
  const duration = durationMins > 0 ? `${hours}h ${mins}m` : "";

  const craftImages = data.craftImage?.map((img) => img.craftImages) ?? [];
  const mainImage = craftImages[0] ?? data.craftDetails?.safetyImage ?? PLANE1;
  const galleryImages = craftImages.length > 0 ? craftImages : [mainImage];

  const activityType = avail?.tourType?.[0] ?? "";

  const passengers: PassengerDetailsForm[] = (data.passengerInfo ?? []).map(
    (p) => ({
      name: p.name ?? "",
      gender: p.gender ?? "",
      age: p.age ?? "",
      weight: p.passengersWeight != null ? `${p.passengersWeight} Kg` : "",
      profileImage: p.profile ?? null,
    })
  );

  const arrival = avail?.route?.[0]?.location ?? route?.location ?? "";

  return {
    id: data.bookingId ?? data._id,
    galleryImages,
    aircraftImage: mainImage,
    aircraftModel: data.craftDetails?.craftModel ?? "",
    city,
    country,
    time: start.isValid() ? start.format("HH:mm") : "",
    date: start.isValid() ? start.format("MMM D, YYYY") : "",
    duration,
    activityType,
    pilot: {
      pilotId: data.pilotDetails?.pilotId ?? "",
      name: data.pilotDetails?.name ?? "",
      avgRating: data.pilotDetails?.avgRating ?? 0,
      profileImage: data.pilotDetails?.profile ?? PLANE1,
    },
    description: avail?.description ?? "",
    features: data.craftDetails?.specialFeature ?? [],
    passengersWeightKg: data.craftDetails?.weightCapacity
      ? `${data.craftDetails.weightCapacity} Kg`
      : data?.passengersWeight
        ? `${data.passengersWeight} Kg`
        : "N/A",
    totalPassengers: String(data.totalPassengers ?? 0),
    aircraftType: data.craftDetails?.craftType ?? "",
    arrival,
    routeCoordinates: avail?.route?.map((r) => ({
      lat: r.lat,
      lng: r.long,
      long: r.long,
      mainLocation: r.mainLocation,
      location: r.location,
      _id: r._id,
    })),
    pricePerPerson: data.totalAmount ?? 0,
    luggageCapacity: data.craftDetails?.luggageCapacity?.[0] ?? "",
    passengers,
  };
}

function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = (params?.bookingId as string) ?? "";
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusConsent, setStatusConsent] = useState<"yes" | "no" | null>(null);
  const [rateFlightModalOpen, setRateFlightModalOpen] = useState(false);
  const { t } = useTranslation("home");
  useScrollToTop();

  const { bookingDetails, isLoading } = useGetBookingDetails(bookingId);
  const { cancelBooking, isPending: isCancelPending } = useCancelBooking();
  const { updateBookingStatus, isPending: isStatusPending } =
    useUpdateBookingStatus();
  const { rateFlight: submitFlightRating, isPending: isRateFlightPending } =
    useRateFlight();
  const booking = useMemo(
    () => mapBookingDetailsToDisplay(bookingDetails),
    [bookingDetails]
  );

  const departureTime = bookingDetails?.availabilityDetails?.departureStartTime;
  const departureEndTime =
    bookingDetails?.availabilityDetails?.departureEndTime ?? null;

  let shouldShowReviewButtons = false;
  if (departureEndTime) {
    const endLocal = moment(departureEndTime).local();
    if (endLocal.isValid()) {
      const nowLocal = moment();
      const hoursSinceEnd = nowLocal.diff(endLocal, "hours", true);
      shouldShowReviewButtons =
        endLocal.isBefore(nowLocal) && hoursSinceEnd <= 48;
    }
  }
  const isUpcoming = Boolean(
    departureTime &&
    moment(departureTime).isValid() &&
    moment(departureTime).isAfter(moment())
  );

  if (isLoading || !booking) {
    return (
      <div className="min-h-[calc(100vh-300px)] flex justify-center items-center bg-[#F8F8FA]">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F8F8FA] pb-12">
      <div className="2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 pt-6">
        <div className="flex justify-between mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5C6268] sm:text-lg text-base font-normal cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied to clipboard");
            }}
            className="flex items-center gap-2 text-[#5C6268] sm:text-lg text-base font-normal cursor-pointer"
          >
            <ImageCustom src={EXPORT_ICON} alt="export" />
            Share
          </button>
        </div>

        <BookingGallery booking={booking} photosIconSrc={PHOTOS_ICON} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BookingPilotCard pilot={booking.pilot} starIconSrc={STAR_ICON} />
          <BookingAircraftCard
            isBookingPage
            booking={booking}
            lampIconSrc={LAMP_ICON}
            airplaneIconSrc={AIRPLANE_ICON}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BookingDescriptionCard
            description={booking.description}
            iconSrc={DOCUMENT_TEXT_ICON}
          />
          <BookingFeaturesCard
            features={booking.features}
            iconSrc={DIAMOND_ICON}
            checkIconSrc={FILLED_CHECK_ICON}
          />
        </div>
        <BookingStatsCards
          passengersWeightKg={booking.passengersWeightKg}
          totalPassengers={booking.totalPassengers}
          aircraftType={booking.aircraftType}
          weightIconSrc={WEIGHT_PURPLE_ICON}
          groupIconSrc={GROUP_ICON}
          airplaneIconSrc={AIRPLANE_OUTLINE_ICON}
          isBookingPage
          luggageCapacity={booking.luggageCapacity}
          className="sm:grid-cols-2"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {booking.passengers?.map((form, index) => (
            <PassengerDetailsCard key={index} index={index} form={form} />
          ))}
        </div>

        <MeetingPointCard
          meetingPointText={booking.arrival ?? ""}
          iconSrc={LOCATION_PURPLE_ICON}
        />

        {booking.routeCoordinates && booking.routeCoordinates.length > 0 && (
          <div className="mb-6">
            <BookingRouteMap
              routeCoordinates={booking.routeCoordinates}
              activityType={booking.activityType}
            />
          </div>
        )}

        <div className="flex flex-col gap-4 justify-center items-center mt-5">
          {bookingDetails?.invoiceUrl ? (
            <Link
              href={bookingDetails.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8D5BEB] sm:text-xl text-lg font-normal underline"
            >
              Invoice
            </Link>
          ) : null}
          {isUpcoming && (
            <Button
              onClick={() => setReasonModalOpen(true)}
              className="bg-[#FF4D4D] sm:text-lg text-base font-semibold text-white sm:w-[377px] w-full"
            >
              CANCEL
            </Button>
          )}
          {bookingDetails?.isFlightCompleted === null &&
          shouldShowReviewButtons ? (
            <div className="px-4 pb-4 flex 3xl:flex-row flex-col gap-3">
              <Button
                type="button"
                className="flex-1 bg-green-700"
                onClick={() => {
                  setStatusConsent("yes");
                  setStatusModalOpen(true);
                }}
              >
                {t("complete")}
              </Button>
              <Button
                type="button"
                className="flex-1 whitespace-nowrap"
                onClick={() => {
                  setStatusConsent("no");
                  setStatusModalOpen(true);
                }}
              >
                {t("needReview")}
              </Button>
            </div>
          ) : bookingDetails?.isRating === false && shouldShowReviewButtons ? (
            <Button
              type="button"
              className="sm:w-[377px] w-full"
              onClick={() => setRateFlightModalOpen(true)}
            >
              {t("addReview")}
            </Button>
          ) : null}
        </div>
      </div>

      <CancelFlightReasonModal
        open={reasonModalOpen}
        onOpenChange={setReasonModalOpen}
        onConfirm={(reasonPayload) => {
          setCancelReason(reasonPayload);
          setReasonModalOpen(false);
          setConfirmModalOpen(true);
        }}
      />
      <CancelFlightConfirmModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        isLoading={isCancelPending}
        onConfirm={async () => {
          await cancelBooking({ bookingId, reason: cancelReason ?? "" });
          router.push("/my-bookings");
          setConfirmModalOpen(false);
        }}
      />
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
      <RateFlightModal
        open={rateFlightModalOpen}
        onOpenChange={setRateFlightModalOpen}
        isPending={isRateFlightPending}
        onSubmit={async (rating, feedback) => {
          if (!bookingDetails?.bookingId) return;
          await submitFlightRating({
            pilotId: bookingDetails.pilotDetails?.pilotId ?? "",
            bookingId: bookingDetails.bookingId,
            rating,
            feedback,
          });
          router.push("/my-bookings");
        }}
      />
    </div>
  );
}

export default BookingDetailsPage;

"use client";

import { useRouter } from "next/navigation";
import { BookingRouteMap } from "@/components/BookingRouteMap";
import {
  BookingAircraftCard,
  BookingDescriptionCard,
  BookingFeaturesCard,
  BookingGallery,
  BookingPilotCard,
  BookingStatsCards,
  LuggageSection,
  MeetingPointCard,
  PassengerDetailsFormCard,
  PassengerSelectSection,
} from "@/components/booking-details";
import type {
  BookingDetailsData,
  PassengerDetailsForm,
  PilotInfo,
} from "@/types/booking";
import FormProvider from "@/form/FormProvider";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { PassengerDetailsSchema } from "@/lib/schema";
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
  USER_PROFILE_ICON,
  WEIGHT_PURPLE_ICON,
} from "@/lib/images";
import ImageCustom from "@/components/common/Image";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import useGetAvailabilityDetails from "@/hooks/home/useGetAvailabilityDetails";
import useGetLuggageList from "@/hooks/auth/useGetLuggageList";
import type {
  IAvailabilityDetails,
  IPassengerSeatWithPrice,
} from "@/types/home";
import moment from "moment";
import { ArrowLeft, Loader } from "lucide-react";
import useBookFlight from "@/hooks/home/useBookFlight";
import type { LuggageOption } from "@/components/booking-details/LuggageSection";
import CongratulationsModal from "@/modal/CongratulationsModal";
import { cn } from "@/lib/utils";
import useScrollToTop from "@/hooks/useScrollToTop";
import PageLoader from "@/components/common/PageLoader";
import { useAuthStore } from "@/store/useAuthStore";

type LuggageListItem = { type: string; title: string; weight: number };

function buildLuggageOptions(
  capacityKeys: string[],
  luggageList: LuggageListItem[]
): LuggageOption[] {
  const noLuggageMatch = luggageList.find((item) => item.type === "NoLuggage");
  const noLuggageOption: LuggageOption = {
    value: "NoLuggage",
    label: noLuggageMatch?.title ?? "No Luggage",
  };
  const otherKeys = capacityKeys.filter((key) => key !== "NoLuggage");
  const otherOptions = otherKeys.map((key) => {
    const match = luggageList.find((item) => item.type === key);
    const label = match
      ? `${match.type} (${match.title}, ~${match.weight} kg)`
      : key;
    return { value: key, label };
  });
  return [noLuggageOption, ...otherOptions];
}

function mapAvailabilityToBooking(
  availability: IAvailabilityDetails | null
): BookingDetailsData | null {
  if (!availability) return null;

  const firstRoute = availability.route?.[0];
  const city = firstRoute?.mainLocation ?? "";
  const country = firstRoute?.location?.split(", ").pop() ?? "";

  const departureMoment = moment(availability.departureStartTime);
  const durationHours = Math.floor(availability.flightDuration / 60);
  const durationMinutes = availability.flightDuration % 60;
  const duration =
    durationHours || durationMinutes
      ? `${durationHours}h ${durationMinutes}m`
      : "";

  const mainImage =
    availability.airCraftData?.airCraftImages?.[0]?.image ??
    availability.airCraftData?.safetyImage ??
    PLANE1;

  const galleryImages = availability.airCraftData?.airCraftImages?.map(
    (img) => img.image
  ) ?? [mainImage];

  const pilot: PilotInfo = {
    pilotId: availability.pilotData?.pilotId ?? "",
    name: availability.pilotData?.name ?? "",
    avgRating: availability.pilotData?.avgRating ?? 0,
    profileImage: availability.pilotData?.profileImage ?? PLANE1,
  };

  return {
    id: availability.availabilityId ?? availability._id,
    galleryImages,
    aircraftImage: mainImage,
    aircraftModel: availability.airCraftData?.craftModel ?? "",
    city,
    country,
    time: departureMoment.isValid() ? departureMoment.format("HH:mm") : "",
    date: departureMoment.isValid()
      ? departureMoment.format("MMM D, YYYY")
      : "",
    duration,
    activityType: availability.tourType?.[0] ?? "",
    pilot,
    description: availability.description ?? "",
    features: availability.airCraftData?.specialFeature ?? [],
    passengersWeightKg: availability.airCraftData?.weightCapacity
      ? `${availability.airCraftData.weightCapacity} Kg`
      : "N/A",
    totalPassengers: availability.seatDtl?.remainingSeats
      ? String(availability.seatDtl.remainingSeats)
      : "",
    aircraftType: availability.airCraftData?.craftType ?? "",
    arrival: availability.route?.[0]?.location,
    routeCoordinates: availability.route?.map((r) => ({
      lat: r.lat,
      lng: r.long,
      long: r.long,
      mainLocation: r.mainLocation,
      location: r.location,
      _id: r._id,
    })),
    pricePerPerson:
      availability.passengerSeatWithPrice?.[0]?.price ?? availability.price,
    luggageCapacity:
      availability.airCraftData?.luggageCapacity?.join(", ") ?? "",
    passengers: [],
  };
}

const defaultPassenger: PassengerDetailsForm = {
  name: "",
  gender: "",
  age: "",
  weight: "",
  profileImage: null,
};

function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation("home");
  const [selectedPassengers, setSelectedPassengers] = useState("1");
  const [selectedLuggage, setSelectedLuggage] = useState("none");
  const [arrivalChecked, setArrivalChecked] = useState(false);
  const [arrivalCheckError, setArrivalCheckError] = useState(false);
  const [congratulationsOpen, setCongratulationsOpen] = useState(false);
  const {token} = useAuthStore();

  const { availabilityDetails, isLoading } = useGetAvailabilityDetails(
    params.flightId as string,
    !!token
  );
  const { luggageList } = useGetLuggageList();
  const { bookFlight, isPending } = useBookFlight();

  const passengerOptions = useMemo(
    () =>
      availabilityDetails?.passengerSeatWithPrice?.map(
        (p: IPassengerSeatWithPrice) => {
          const price = p.price ?? 0;
          const refund = p.refundAmount ?? 0;
          return {
            value: String(p.seat),
            label: `${p.seat} Passenger: (€${price.toFixed(
              2
            )} - €${refund.toFixed(2)} Max. Refund)`,
          };
        }
      ) ?? [],
    [availabilityDetails]
  );

  const booking = useMemo(
    () => mapAvailabilityToBooking(availabilityDetails),
    [availabilityDetails]
  );

  const luggageOptions = useMemo((): LuggageOption[] => {
    const capacityKeys =
      availabilityDetails?.airCraftData?.luggageCapacity ?? [];
    return buildLuggageOptions(capacityKeys, luggageList);
  }, [availabilityDetails?.airCraftData?.luggageCapacity, luggageList]);

  useEffect(() => {
    if (
      luggageOptions.length > 0 &&
      !luggageOptions.some((o) => o.value === selectedLuggage)
    ) {
      setSelectedLuggage(luggageOptions[0].value);
    }
  }, [luggageOptions, selectedLuggage]);

  useScrollToTop();

  const passengerCount = parseInt(selectedPassengers, 10);

  const { bookingClosesAt, isSoldOut, isBookDisabled } = useMemo(() => {
    const departure = availabilityDetails?.departureStartTime;
    const closesAt = departure
      ? moment(departure).utc().subtract(24, "hours")
      : null;
    const now = moment.utc();
    const closed = !!closesAt && now.isSameOrAfter(closesAt);
    const soldOut = (availabilityDetails?.seatDtl?.remainingSeats ?? 0) === 0;
    return {
      bookingClosesAt: closesAt,
      isBookingClosed: closed,
      isSoldOut: soldOut,
      isBookDisabled: closed || soldOut,
    };
  }, [
    availabilityDetails?.departureStartTime,
    availabilityDetails?.seatDtl?.remainingSeats,
  ]);

  const priceSummary = useMemo(() => {
    const seatPrice = availabilityDetails?.passengerSeatWithPrice?.find(
      (p: IPassengerSeatWithPrice) => String(p.seat) === selectedPassengers
    );

    const pricePerPerson = seatPrice?.price ?? 0;
    const servicePct = availabilityDetails?.servicePercentage ?? 0;
    const platformFee = pricePerPerson * (servicePct / 100);
    const total = pricePerPerson + platformFee;
    return {
      person: seatPrice?.seat,
      pricePerPerson,
      flightCost: seatPrice?.price,
      platformFee,
      total,
    };
  }, [availabilityDetails, selectedPassengers, passengerCount]);

  const bookingSchema = useMemo(
    () =>
      yup.object().shape({
        passengers: yup
          .array()
          .of(PassengerDetailsSchema)
          .min(
            passengerCount,
            `Please fill all details for ${passengerCount} passenger(s)`
          ),
      }),
    [passengerCount]
  );

  const resolver = useCallback(
    (
      values: { passengers: PassengerDetailsForm[] },
      context: unknown,
      options: unknown
    ) => {
      const toValidate = {
        passengers: (values.passengers || []).slice(0, passengerCount),
      };
      return yupResolver(bookingSchema)(
        toValidate as never,
        context as never,
        options as never
      ) as ReturnType<Resolver<{ passengers: PassengerDetailsForm[] }>>;
    },
    [bookingSchema, passengerCount]
  ) as Resolver<{ passengers: PassengerDetailsForm[] }>;

  const methods = useForm<{ passengers: PassengerDetailsForm[] }>({
    defaultValues: {
      passengers: [
        { ...defaultPassenger },
        { ...defaultPassenger },
        { ...defaultPassenger },
      ],
    },
    resolver,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (
      passengerOptions.length > 0 &&
      !passengerOptions.some(
        (o: { value: string }) => o.value === selectedPassengers
      )
    ) {
      setSelectedPassengers(passengerOptions[0].value);
    }
  }, [passengerOptions, selectedPassengers]);

  const hasPrefilledUser = useRef(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !availabilityDetails ||
      hasPrefilledUser.current
    )
      return;
    try {
      const raw = localStorage.getItem("user");
      const user = raw
        ? (JSON.parse(raw) as {
            name?: string;
            weight?: string;
            profile?: string;
            image?: string;
          })
        : null;
      if (!user?.name) return;
      hasPrefilledUser.current = true;
      methods.setValue("passengers.0.name", user.name ?? "", {
        shouldValidate: false,
      });
      if (user.weight)
        methods.setValue("passengers.0.weight", user.weight, {
          shouldValidate: false,
        });
      const imageUrl = user.profile;
      if (imageUrl && typeof imageUrl === "string") {
        methods.setValue("passengers.0.profileImage", imageUrl, {
          shouldValidate: false,
        });
      }
    } catch {}
  }, [availabilityDetails, methods]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = new URLSearchParams(window.location.search);
    if (search.get("isSuccess") === "true") {
      setCongratulationsOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleBookNow = useCallback(() => {
    methods.handleSubmit(async (formValues) => {
      if (!arrivalChecked) {
        setArrivalCheckError(true);
        return;
      }
      if (!availabilityDetails) return;
      const availabilityId =
        availabilityDetails.availabilityId ?? availabilityDetails._id;
      const passengerCount = parseInt(selectedPassengers, 10);
      const passengers = (formValues.passengers ?? []).slice(0, passengerCount);
      const seatPrice = availabilityDetails.passengerSeatWithPrice?.find(
        (p: IPassengerSeatWithPrice) => String(p.seat) === selectedPassengers
      );
      const totalAmount = (priceSummary.total ?? 0) * passengerCount;
      const refundAmount = (seatPrice?.refundAmount ?? 0) * passengerCount;
      const passengersWeight = passengers.reduce(
        (sum, p) => sum + (Number(p.weight) || 0),
        0
      );
      const luggageWeight =
        luggageList.find(
          (item: LuggageListItem) => item.type === selectedLuggage
        )?.weight ?? 0;
      const tourType = availabilityDetails.tourType?.[0] ?? "oneWay";

      const formData = new FormData();
      formData.append("availabilityId", availabilityId);
      formData.append("totalPassengers", String(passengerCount));
      formData.append("passengersWeight", String(passengersWeight));
      formData.append("luggageWeight", String(luggageWeight));
      formData.append("tourType", tourType);
      passengers.forEach((p, i) => {
        formData.append(`passengerInfo[${i}][name]`, p.name ?? "");
        formData.append(`passengerInfo[${i}][age]`, String(p.age ?? ""));
        formData.append(`passengerInfo[${i}][gender]`, p.gender ?? "");
        if (p.profileImage instanceof File) {
          formData.append(`passengerInfo[${i}][profile]`, p.profileImage);
        }
      });
      formData.append("totalAmount", String(totalAmount));
      formData.append("refundAmount", String(refundAmount));

      const successPath = `/home/${params.flightId}?isSuccess=true`;
      const webUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${successPath}`
          : successPath;
      formData.append("webUrl", encodeURIComponent(webUrl));
      formData.append("from", "web");

      bookFlight(formData as FormData).then((result) => {
        const bookingData = (
          result as {
            data?: { callback?: string; bookingId?: string };
            message?: string;
          }
        )?.data;
        if (bookingData?.callback) {
          window.location.href = bookingData.callback;
          return;
        }
      });
    })();
  }, [
    arrivalChecked,
    availabilityDetails,
    bookFlight,
    luggageList,
    methods,
    params.flightId,
    priceSummary,
    selectedPassengers,
    selectedLuggage,
  ]);

  if (isLoading || !booking) {
    return (
      <div className="min-h-[calc(100vh-300px)] flex justify-center items-center">
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
            {t("share")}
          </button>
        </div>

        <BookingGallery
          booking={availabilityDetails}
          photosIconSrc={PHOTOS_ICON}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <BookingPilotCard pilot={booking.pilot} starIconSrc={STAR_ICON} />
          <BookingAircraftCard
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
          totalPassengers={booking.totalPassengers || "0"}
          aircraftType={booking.aircraftType}
          weightIconSrc={WEIGHT_PURPLE_ICON}
          groupIconSrc={GROUP_ICON}
          airplaneIconSrc={AIRPLANE_OUTLINE_ICON}
          luggageCapacity={booking.luggageCapacity}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <LuggageSection
            selectedLuggage={selectedLuggage}
            onSelect={setSelectedLuggage}
            iconSrc={WEIGHT_PURPLE_ICON}
            options={luggageOptions.length > 0 ? luggageOptions : []}
          />
          <PassengerSelectSection
            selectedPassengers={selectedPassengers}
            onSelect={setSelectedPassengers}
            userIconSrc={USER_PROFILE_ICON}
            options={passengerOptions}
          />
        </div>

        <FormProvider methods={methods} onSubmit={() => {}}>
          {passengerOptions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Array.from({ length: passengerCount }).map((_, index) => (
                <PassengerDetailsFormCard
                  key={index}
                  index={index}
                  fieldPrefix={`passengers.${index}`}
                />
              ))}
            </div>
          )}

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

          <div className="bg-white rounded-xl shadow-7xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={arrivalChecked}
                onCheckedChange={(checked) => {
                  setArrivalChecked(checked === true);
                  setArrivalCheckError(false);
                }}
                className={`size-10 bg-[#F5F5F5] border-none rounded-[10px] shrink-0 ${arrivalCheckError ? "ring-2 ring-red-500" : ""}`}
              />
              <span className="font-light text-lg">
                {t("costSharedFlight")}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-7xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              {bookingClosesAt ? (
                <p className="text-[#F15E5E] font-medium text-base mb-4">
                  {t("bookingWillBeClosedOn")}{" "}
                  {bookingClosesAt.local().format("D MMM YYYY")} {t("at")}{" "}
                  {bookingClosesAt.local().format("h:mm A")}.
                </p>
              ) : null}
              <div className="space-y-2 text-[#1F1F1F]">
                <p className="text-lg font-light">
                  {t("flightCost")}:{" "}
                  <span className="text-primary">
                    €{priceSummary.pricePerPerson.toFixed(2)}/
                    {priceSummary?.person} person
                  </span>
                </p>
                <p className="text-lg font-light">
                  {t("platformFee")}:{" "}
                  <span className="text-primary">
                    €{priceSummary.platformFee.toFixed(2)}
                  </span>
                </p>
                <p className="text-lg font-medium">
                  {t("totalCost")}:{" "}
                  <span className="text-primary">
                    €{priceSummary.total.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
            <Button
              type="button"
              className={cn(
                "w-[193px] min-h-12!",
                isSoldOut ? "bg-[#F15E5E]" : ""
              )}
              onClick={handleBookNow}
              disabled={isBookDisabled || isPending}
            >
              {isPending ? (
                <Loader className="size-5 animate-spin" />
              ) : isBookDisabled && isSoldOut ? (
                t("soldOut")
              ) : (
                t("bookNow")
              )}
            </Button>
          </div>
        </FormProvider>
      </div>

      <CongratulationsModal
        open={congratulationsOpen}
        setOpen={setCongratulationsOpen}
      />
    </div>
  );
}

export default BookingDetailsPage;

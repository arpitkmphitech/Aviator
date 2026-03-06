"use client";

import type { BookingTab, FlightBooking, MyBookingItem } from "@/types/booking";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { BOOKING_TABS } from "@/lib/statics";
import { BookingCard } from "@/components/home/BookingCars";
import { useTranslation } from "react-i18next";
import useGetBookings from "@/hooks/home/useGetBooking";
import Button from "@/components/common/Button";
import PageLoader from "@/components/common/PageLoader";
import moment from "moment";

function mapMyBookingToFlightBooking(
  item: MyBookingItem,
  isUpcoming: boolean
): FlightBooking {
  const start = moment(item.departureStartTime).local();
  const end = moment(item.departureEndTime).local();
  const durationMins = Math.round(end.diff(start, "minutes", true));
  const hours = Math.floor(durationMins / 60);
  const mins = durationMins % 60;
  const duration = durationMins > 0 ? `${hours}h ${mins}m` : "0h 0m";

  const city = item.route?.[0]?.mainLocation ?? "";
  const locationStr = item.route?.[0]?.location ?? "";
  const country = locationStr.split(",").pop()?.trim() ?? "";

  return {
    id: item.bookingId,
    aircraftImage: item.craftDetails?.safetyImage ?? "",
    aircraftModel: item.craftDetails?.craftModel ?? "",
    passengers: item.totalPassengers ?? 0,
    city,
    country,
    time: start.format("HH:mm"),
    date: start.format("MMM D, YYYY"),
    duration,
    activityType: item.tourType,
    isUpcoming,
    isFlightCompleted: item.isFlightCompleted,
    departureEndTime: item.departureEndTime,
    bookingType: item.bookingType,
  };
}

const MyBookingsPage: React.FC = () => {
  const { t } = useTranslation("home");
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [page, setPage] = useState(0);
  const [accumulatedBookings, setAccumulatedBookings] = useState<
    FlightBooking[]
  >([]);
  const lastTotalRef = useRef(0);

  const isUpcoming = activeTab === "upcoming";
  const {
    bookings: apiBookings,
    total,
    isLoading,
    isFetching,
  } = useGetBookings({
    type: activeTab,
    skip: page * 12,
    limit: 12,
  });

  useEffect(() => {
    if (activeTab !== "upcoming" && activeTab !== "past") return;
    setPage(0);
    setAccumulatedBookings([]);
  }, [activeTab]);

  useEffect(() => {
    const mapped = (apiBookings as MyBookingItem[]).map((b) =>
      mapMyBookingToFlightBooking(b, isUpcoming)
    );
    if (page === 0) {
      setAccumulatedBookings(mapped);
    } else {
      setAccumulatedBookings((prev) => [...prev, ...mapped]);
    }
  }, [page, isUpcoming, apiBookings?.length, apiBookings]);

  if (total > 0) {
    lastTotalRef.current = total;
  }
  const totalRecords = total > 0 ? total : lastTotalRef.current;
  const hasMore = totalRecords > accumulatedBookings.length;
  const isLoadingMore = page > 0 && isFetching;

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  return (
    <div className="min-h-full bg-[#F8F8FA] py-6 sm:py-8 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex gap-2 mb-6 sm:mb-8">
        {BOOKING_TABS?.map((val: { value: string; label: string }) => {
          return (
            <button
              key={val.value}
              type="button"
              onClick={() => setActiveTab(val.value as BookingTab)}
              className={cn(
                "cursor-pointer rounded-full px-5 py-3 transition-colors",
                activeTab === val.value
                  ? "bg-[#7854B8] text-white sm:text-lg text-base font-semibold "
                  : "bg-white text-[#6B7280] border border-[#ECECED] sm:text-lg text-base font-medium"
              )}
            >
              {t(val.label)}
            </button>
          );
        })}
      </div>

      {isLoading && page === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <PageLoader />
        </div>
      ) : accumulatedBookings.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-[#6B7280] text-base">{t("noBookingsFound")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {accumulatedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                loader={isLoadingMore}
                className="max-h-8! w-fit"
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBookingsPage;

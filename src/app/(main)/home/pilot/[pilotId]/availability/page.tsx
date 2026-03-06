"use client";

import Button from "@/components/common/Button";
import FlightCard from "@/components/home/FlightCard";
import useGetPilotUpcomingFlights from "@/hooks/home/useGetPilotUpcomingFlights";
import type { IFlightAvailabilityItem } from "@/types/home";
import { ArrowLeft, Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PageLoader from "@/components/common/PageLoader";

export default function PilotAvailabilityPage() {
  const router = useRouter();
  const { t } = useTranslation("home");
  const { pilotId } = useParams<{ pilotId: string }>();

  const [skip, setSkip] = useState(0);
  const [accumulatedFlights, setAccumulatedFlights] = useState<
    IFlightAvailabilityItem[]
  >([]);
  const lastMergedSkipRef = useRef(-1);
  const lastTotalRef = useRef(0);

  const { upcomingFlights, total, isLoading, isFetching } =
    useGetPilotUpcomingFlights({
      pilotId: pilotId ?? "",
      skip,
      limit: 12,
    });

  if (total > 0) {
    lastTotalRef.current = total;
  }

  useEffect(() => {
    if (!upcomingFlights?.length && skip === 0) {
      lastMergedSkipRef.current = -1;
      setAccumulatedFlights((prev) => (prev.length === 0 ? prev : []));
      return;
    }

    if (skip === 0) {
      lastMergedSkipRef.current = 0;
      setAccumulatedFlights(upcomingFlights);
      return;
    }

    if (skip > lastMergedSkipRef.current && upcomingFlights?.length) {
      lastMergedSkipRef.current = skip;
      setAccumulatedFlights((prev) => [...prev, ...upcomingFlights]);
    }
  }, [skip, upcomingFlights]);

  const totalRecords = total > 0 ? total : lastTotalRef.current;
  const hasMore = totalRecords > accumulatedFlights.length;
  const isLoadingMore = skip > 0 && isFetching;

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
        </div>
      </div>

      {isLoading && skip === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <PageLoader />
        </div>
      ) : accumulatedFlights.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-[#6B7280] text-base">{t("noFlightsFound")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {accumulatedFlights.map((flight) => (
              <FlightCard key={flight.availabilityId} flight={flight} />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                loader={isLoadingMore}
                disabled={isLoadingMore}
                className="max-h-8! w-fit"
                onClick={() => setSkip((s) => s + 12)}
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import ImageCustom from "@/components/common/Image";
import { HOME_BG } from "@/lib/images";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookTripCard,
  type SearchFlightsParams,
} from "@/components/home/BookTripCard";
import Button from "@/components/common/Button";
import FlightCard from "@/components/home/FlightCard";
import { FilterModal } from "@/components/home/FilterModal";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSearchFlights } from "@/hooks/home/useSearchFlights";
import { Loader } from "lucide-react";
import Cookies from "js-cookie";
import useLogin from "@/hooks/auth/useLogin";
import { ILoginRequest } from "@/types/auth";
import PageLoader from "@/components/common/PageLoader";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation("home");
  const token = Cookies.get("token");
  const { login } = useLogin();
  console.log(token);
  const [filterOpen, setFilterOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlightIds, setSelectedFlightIds] = useState<Set<string>>(
    new Set()
  );

  const { flightResults, loading, loadMoreLoading, hasMore, search, loadMore } =
    useSearchFlights();
  const [searchParams, setSearchParams] = useState<SearchFlightsParams | null>(
    null
  );
  const [priceRange, setPriceRange] = useState<string>("");

  useEffect(() => {
    const initialParams: SearchFlightsParams = { tourType: "sightseeing" };
    setSearchParams(initialParams);
    search(initialParams);
  }, [search]);

  const handleSearch = (params: SearchFlightsParams) => {
    setHasSearched(true);
    setSearchParams(params);
    search(params);
  };

  const handleTourTypeChange = (params: SearchFlightsParams) => {
    setHasSearched(true);
    setSearchParams(params);
    setPriceRange("");
    search(params);
  };

  const handleApplyPriceRange = (
    range: {
      priceMin: number;
      priceMax: number;
    } | null
  ) => {
    if (!searchParams) return;

    const nextParams: SearchFlightsParams = { ...searchParams };
    let nextPriceRange = "";

    if (range) {
      nextParams.priceMin = range.priceMin;
      nextParams.priceMax = range.priceMax;
      nextPriceRange = `${range.priceMin}-${range.priceMax}`;
    } else {
      delete nextParams.priceMin;
      delete nextParams.priceMax;
    }

    setSearchParams(nextParams);
    setPriceRange(nextPriceRange);
    search(nextParams);
  };

  const handleToggleFlight = (flightId: string, checked: boolean) => {
    setSelectedFlightIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        if (next.size >= 2 && !next.has(flightId)) return prev;
        next.add(flightId);
      } else {
        next.delete(flightId);
      }
      return next;
    });
  };

  const canCompare = selectedFlightIds.size >= 2;

  const handleCompare = () => {
    const selected = flightResults.filter((f) =>
      selectedFlightIds.has(f.availabilityId)
    );
    if (selected.length >= 2) {
      const json = JSON.stringify(selected.slice(0, 2));
      const data = btoa(json)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      router.push(`/home/compare?data=${data}`);
    }
  };

  useEffect(() => {
    if (!token) {
      login({
        email: "guest@gmail.com",
        password: "f925916e2754e5e03f75dd58a5733251",
        userType: "traveller",
        lang: "en",
      } as ILoginRequest);
    }
  }, [token]);

  return (
    <ScrollArea className="flex-1 min-h-0 overflow-y-auto bg-[#F6F6F7]">
      <div className="relative w-full z-20">
        <ImageCustom
          src={HOME_BG}
          alt="HOME_BG"
          className="absolute z-10 w-full lg:h-full object-cover object-center h-[300px]"
        />

        <div className="relative z-20 xl:top-32 lg:top-24 md:top-36 top-30 w-full 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 xl:pt-60 lg:pt-44">
          <BookTripCard
            onSearch={handleSearch}
            onTourTypeChange={handleTourTypeChange}
          />
        </div>
      </div>

      <div className="py-16 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5 mt-24">
        <div className="flex justify-between items-center mb-9 gap-4 flex-wrap">
          <h2 className="text-xl sm:text-2xl md:text-[30px] font-medium text-black">
            {hasSearched ? t("flightResults") : t("discoverFlights")}
          </h2>
          {hasSearched && (
            <div className="flex items-center gap-3">
              {canCompare && (
                <Button
                  onClick={handleCompare}
                  className="max-w-[180px] font-medium text-base sm:text-lg whitespace-nowrap"
                >
                  {t("compareFlight")}
                </Button>
              )}
              <Button
                onClick={() => setFilterOpen(true)}
                className="max-w-[141px] font-medium text-base sm:text-lg"
              >
                {t("filter")}
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <PageLoader />
            </div>
          ) : flightResults?.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {flightResults.map((flight) => (
                  <FlightCard
                    key={flight.availabilityId}
                    flight={flight}
                    showCheckbox={hasSearched}
                    checked={selectedFlightIds.has(flight.availabilityId)}
                    onCheckedChange={(c) =>
                      handleToggleFlight(flight.availabilityId, c)
                    }
                    checkboxDisabled={
                      selectedFlightIds.size >= 2 &&
                      !selectedFlightIds.has(flight.availabilityId)
                    }
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={loadMore}
                    disabled={loadMoreLoading}
                    loader={loadMoreLoading}
                    className="max-w-[200px]"
                  >
                    {loadMoreLoading ? t("loading") : t("loadMore")}
                  </Button>
                </div>
              )}
            </>
          ) : hasSearched ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <p className="text-gray-500">{t("noFlightsFound")}</p>
            </div>
          ) : null}
        </div>
      </div>

      <FilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApplyPriceRange={handleApplyPriceRange}
        priceRange={priceRange}
      />
    </ScrollArea>
  );
};

export default HomePage;

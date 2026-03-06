import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ImageCustom from "../common/Image";
import Button from "../common/Button";
import { AIRPLANE_ICON, FILTER_ICON, SEARCH_ICON } from "@/lib/images";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { WishlistProposal } from "@/types/booking";
import { useTranslation } from "react-i18next";
import { useWishFlightOffer } from "@/hooks/wishlist/useWishFlightOffer";
import moment from "moment";
import { convertMinutesToHours, routePointDisplay } from "@/lib/utils";
import PageLoader from "../common/PageLoader";
import { useBidRequestStatus } from "@/hooks/wishlist/useBidRequestStatus";
import LuggageDisplay from "@/components/common/LuggageDisplay";

const WishlistProposals = () => {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation("wishlist");
  const wishlistId = (params?.wishlistId as string) ?? "";

  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [bidStatusFilter, setBidStatusFilter] = useState<
    "all" | "Pending" | "Booked" | "Rejected"
  >("all");
  const [priceFilter, setPriceFilter] = useState<"low_to_high" | "high_to_low">(
    "low_to_high"
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const {
    wishFlightOffers,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useWishFlightOffer({
    wishFlightId: wishlistId,
    limit: 10,
    search: search || undefined,
    ...(bidStatusFilter !== "all" ? { bidStatus: [bidStatusFilter] } : {}),
    priceFilter,
  });

  const { updateBidRequestStatus, isPending: isUpdatingBidRequestStatus } =
    useBidRequestStatus();

  const hasMore = !!hasNextPage;
  const initialLoading = isLoading && !wishFlightOffers.length;
  const loadingMore = isFetchingNextPage;

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    fetchNextPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      setSearch(trimmed);
    }, 600);
  };

  const handleAccept = (id: string) => {
    router.push(`/wishlist/${wishlistId}/confirm/${id}`);
  };

  const handleReject = (id: string) => {
    setIsRejectLoading(true);
    updateBidRequestStatus(
      {
        status: "Rejected",
        bidId: id,
      },
      {
        onSuccess: () => {
          setIsRejectLoading(false);
        },
        onError: () => {
          setIsRejectLoading(false);
        },
      }
    );
  };

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-[30px] font-medium text-black">
            {t("allProposals")}
          </h1>
        </div>

        <div className="w-full sm:w-[380px] relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <ImageCustom src={SEARCH_ICON} alt="search" />
          </span>
          <Input
            type="text"
            placeholder={t("searchProposals")}
            className="h-14 w-full border border-[#F5F5F5] bg-white pl-12 pr-12"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
              >
                <ImageCustom src={FILTER_ICON} alt="filter" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-4 space-y-4">
              <div>
                <PopoverHeader className="mb-2">
                  <PopoverTitle className="text-sm font-medium text-[#111827]">
                    {t("status")}
                  </PopoverTitle>
                </PopoverHeader>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "all", labelKey: "all" },
                    { value: "Pending", labelKey: "pending" },
                    { value: "Booked", labelKey: "booked" },
                    { value: "Rejected", labelKey: "rejected" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setBidStatusFilter(
                          option.value as
                            | "all"
                            | "Pending"
                            | "Booked"
                            | "Rejected"
                        )
                      }
                      className="flex items-center gap-2 text-sm text-[#111827] cursor-pointer"
                    >
                      <Checkbox
                        checked={bidStatusFilter === option.value}
                        onCheckedChange={() =>
                          setBidStatusFilter(
                            option.value as
                              | "all"
                              | "Pending"
                              | "Booked"
                              | "Rejected"
                          )
                        }
                        className="size-4 rounded-[6px]"
                      />
                      <span className="capitalize">{t(option.labelKey)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <PopoverHeader className="mb-2">
                  <PopoverTitle className="text-sm font-medium text-[#111827]">
                    {t("sortBy")}
                  </PopoverTitle>
                </PopoverHeader>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPriceFilter("low_to_high");
                    }}
                    className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer"
                  >
                    <Checkbox
                      checked={priceFilter === "low_to_high"}
                      onCheckedChange={() => {
                        setPriceFilter("low_to_high");
                      }}
                      className="size-4 rounded-[6px]"
                    />
                    <span>{t("priceLowToHigh")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPriceFilter("high_to_low");
                    }}
                    className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer"
                  >
                    <Checkbox
                      checked={priceFilter === "high_to_low"}
                      onCheckedChange={() => {
                        setPriceFilter("high_to_low");
                      }}
                      className="size-4 rounded-[6px]"
                    />
                    <span>{t("priceHighToLow")}</span>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!wishFlightOffers?.length && !isLoading && !isError && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          {t("noProposalsFound") || "No proposals yet."}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
          {(error as Error)?.message || "Failed to load proposals."}
        </div>
      )}

      {initialLoading && (
        <div className="flex justify-center items-center py-12">
          <PageLoader duration={10000} />
        </div>
      )}

      {!initialLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {wishFlightOffers?.length > 0 &&
            wishFlightOffers?.map((proposal: WishlistProposal) => {
              const route = proposal?.flightDetails?.route;
              const fromDisplay = route?.length
                ? routePointDisplay(route[0])
                : "";
              const toDisplay = route?.length
                ? routePointDisplay(route[route.length - 1])
                : "";
              const from = fromDisplay || (proposal?.flightDetails?.from ?? "");
              const to = toDisplay || (proposal?.flightDetails?.to ?? "");
              return (
                <div
                  key={proposal._id}
                  className="flex flex-col rounded-[20px] bg-white p-5 shadow-[0px_7px_4.6px_0px_#7854B814]"
                >
                  <div className="flex items-start justify-between border-b border-[#F5F5F5] pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <ImageCustom
                        src={proposal?.pilotDetails?.profile}
                        alt={proposal?.pilotDetails?.name}
                        className="size-[46px] rounded-full"
                      />
                      <div>
                        <p className="text-xs font-normal text-[#98A1AB]">
                          {t("pilotName")}
                        </p>
                        <p className="text-base font-semibold text-black">
                          {proposal?.pilotDetails?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-primary">
                      <span className="font-bold text-[20px]">
                        €{proposal.perPersonAmount}
                      </span>
                      <span className="font-medium text-sm text-primary">
                        {t("perPerson")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center w-full gap-4 min-w-0 border-b border-[#F5F5F5] pb-3 mb-3">
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
                        {moment(proposal.flightDetails?.departureStartTime)
                          .local()
                          .format("MMM DD, YYYY HH:mm")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("passengers")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        {proposal.flightDetails?.totalPassengers}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("flightType")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base capitalize">
                        {proposal.flightDetails?.tourType}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("flightDuration")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        {convertMinutesToHours(
                          Number(proposal.flightDetails?.flightDuration)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#F3F4F6] pt-3 sm:pt-4 gap-3">
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("luggage")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        <LuggageDisplay
                          luggageType={proposal.flightDetails?.luggageType}
                        />
                      </p>
                    </div>

                    <div className="flex items-stretch xs:items-center gap-3 justify-end">
                      {proposal?.bidStatus === "Pending" && (
                        <>
                          <Button
                            className="min-h-11! w-full xs:w-[146px] border border-[#98A1AB] text-[#98A1AB] bg-white"
                            onClick={() => handleReject(proposal._id)}
                            disabled={isRejectLoading}
                            loader={isRejectLoading}
                          >
                            {t("reject")}
                          </Button>
                          <Button
                            className="min-h-11! w-full xs:w-[146px]"
                            onClick={() => handleAccept(proposal._id)}
                            disabled={isAcceptLoading}
                            loader={isAcceptLoading}
                          >
                            {t("accept")}
                          </Button>
                        </>
                      )}
                      {proposal?.bidStatus === "Accepted" && (
                        <span className="inline-flex items-center rounded-[12px] px-6 py-2.5 text-base font-medium bg-[#32D8321A] text-[#0E922F]">
                          {t("approved")}
                        </span>
                      )}
                      {proposal?.bidStatus === "Rejected" && (
                        <span className="inline-flex items-center rounded-[12px] px-6 py-2.5 text-base font-medium bg-[#FFE2E2] text-[#DC2626]">
                          {t("rejected")}
                        </span>
                      )}
                      {proposal?.bidStatus === "Booked" && (
                        <span className="inline-flex items-center rounded-[12px] px-6 py-2.5 text-base font-medium bg-[#32D8321A] text-[#0E922F]">
                          {t("booked")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {hasMore && (
            <div className="col-span-full flex justify-center items-center gap-2 py-6">
              <Button
                className="min-h-0 w-auto px-6 py-2.5 text-sm"
                onClick={handleLoadMore}
                disabled={loadingMore}
                loader={loadingMore}
              >
                {t("loadMore") || "Load more"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistProposals;

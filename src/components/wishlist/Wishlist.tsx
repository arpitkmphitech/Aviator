"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { cn, convertMinutesToHours, routePointDisplay } from "@/lib/utils";
import Button from "../common/Button";
import ImageCustom from "../common/Image";
import { AIRPLANE_ICON, FILTER_ICON, SEARCH_ICON } from "@/lib/images";
import { WishlistItem } from "@/types/booking";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../ui/popover";
import { useTranslation } from "react-i18next";
import { useWishList } from "@/hooks/wishlist/useWishList";
import LuggageDisplay from "@/components/common/LuggageDisplay";
import moment from "moment";
import PageLoader from "../common/PageLoader";
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "../ui/radio-group";

const statusStyles: Record<string, string> = {
  Pending: "bg-[#D8AC3233] text-[#92540E]",
  Booked: "bg-[#32D8321A] text-[#0E922F]",
  Closed: "bg-[#E5E7EB] text-[#4B5563]",
  Expired: "bg-[#FEE2E2] text-[#B91C1C]",
};

const Wishlist = () => {
  const router = useRouter();
  const [skip, setSkip] = useState(0);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Pending" | "Booked" | "Closed" | "Expired"
  >("all");

  const { t } = useTranslation("wishlist");
  const { t: tProfile } = useTranslation("profile");

  const {
    wishList,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useWishList({
    limit: 10,
    search,
    requestStatus:
      statusFilter && statusFilter !== "all" ? [statusFilter] : undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim();
      setSearch(trimmed);
      // reset pagination when search changes
      setSkip(0);
      setItems([]);
    }, 600);
  };

  const initialLoading = isLoading && skip === 0 && items.length === 0;

  return (
    <div className="bg-[#F6F6F7] py-[30px] 2xl:px-24 xl:px-16 lg:px-12 md:px-8 px-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between sm:gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#5C6268] cursor-pointer"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-[30px] font-medium text-black">
            {t("allWishes")}
          </h1>
        </div>
        <div className="flex flex-col-reverse gap-4 w-full md:flex-row md:w-auto">
          <div className="relative w-full md:w-[370px]">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <ImageCustom src={SEARCH_ICON} alt="search" />
            </span>
            <Input
              type="text"
              placeholder={t("searchWishes")}
              className="h-14 w-full border border-[#F5F5F5] bg-white pl-12 pr-12"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <ImageCustom src={FILTER_ICON} alt="filter" />{" "}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60 p-4">
                <PopoverHeader className="mb-3">
                  <PopoverTitle className="text-sm font-medium text-[#111827]">
                    {t("status")}
                  </PopoverTitle>
                </PopoverHeader>
                <RadioGroup
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(
                      value as
                        | "all"
                        | "Pending"
                        | "Booked"
                        | "Closed"
                        | "Expired"
                    )
                  }
                  className="gap-2"
                >
                  <div className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                    <RadioGroupItem
                      value="all"
                      className="size-6 rounded-[11px]"
                    />
                    <span>{t("all")}</span>
                  </div>
                  <div className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                    <RadioGroupItem
                      value="Pending"
                      className="size-6 rounded-[11px]"
                    />
                    <span>{t("pending")}</span>
                  </div>
                  <div className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                    <RadioGroupItem
                      value="Booked"
                      className="size-6 rounded-[11px]"
                    />
                    <span>{t("booked")}</span>
                  </div>
                  <div className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                    <RadioGroupItem
                      value="Closed"
                      className="size-6 rounded-[11px]"
                    />
                    <span>{t("closed")}</span>
                  </div>
                  <div className="w-fit flex items-center gap-2 text-sm text-[#111827] cursor-pointer">
                    <RadioGroupItem
                      value="Expired"
                      className="size-6 rounded-[11px]"
                    />
                    <span>{t("expired")}</span>
                  </div>
                </RadioGroup>
              </PopoverContent>
            </Popover>
          </div>
          <Button
            onClick={() => router.push("/wishlist/new")}
            className="w-full md:w-[186px] bg-primary text-lg font-normal whitespace-nowrap flex gap-2"
          >
            <Plus className="min-h-5 min-w-5" /> {t("createNew")}
          </Button>
        </div>
      </div>

      {!wishList?.length && !isLoading && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
          {t("noWishes") || "No wishes yet."}
        </div>
      )}

      {initialLoading && (
        <div className="flex justify-center items-center py-12">
          <PageLoader duration={10000} />
        </div>
      )}

      {!initialLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishList?.length > 0 &&
            wishList?.map((wish: WishlistItem) => {
              const route = wish?.route;
              const fromDisplay = route?.length
                ? routePointDisplay(route[0])
                : "";
              const toDisplay = route?.length
                ? routePointDisplay(route[route.length - 1])
                : "";
              const from = fromDisplay || (wish.from ?? "");
              const to = toDisplay || (wish.to ?? "");

              return (
                <div
                  key={wish._id}
                  onClick={() => router.push(`/wishlist/${wish._id}`)}
                  className="flex flex-col rounded-[20px] bg-white p-4 sm:p-5 shadow-[0px_7px_4.6px_0px_#7854B814] cursor-pointer transition-shadow hover:shadow-[0px_12px_14px_0px_#7854B822]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-base text-primary">
                      {wish?.proposalCount}{" "}
                      <span className="text-[#2C2C2C] font-medium">
                        {t("proposal")}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center w-full gap-4 min-w-0 border-b border-[#F5F5F5] pb-3 mb-3">
                    <div className="min-w-0 shrink-0 overflow-hidden max-w-[40%]">
                      <p className="text-sm font-normal text-[#98A1AB]">
                        {t("from")}
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
                        {t("to")}
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
                        {moment(wish.departureStartTime)
                          .local()
                          .format("MMM DD, YYYY HH:mm")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("passengers")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        {wish.totalPassengers}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("flightType")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base capitalize">
                        {wish.tourType}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("flightDuration")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        {convertMinutesToHours(Number(wish.flightDuration))}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3 sm:pt-4">
                    <div>
                      <p className="font-medium text-sm text-[#98A1AB]">
                        {t("luggage")}
                      </p>
                      <p className="mt-1 text-black font-medium text-base">
                        <LuggageDisplay luggageType={wish.luggageType} />
                      </p>
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center rounded-[12px] px-[42px] py-2.5 text-base font-medium",
                        statusStyles[wish.requestStatus] ||
                          "bg-gray-100 text-gray-600"
                      )}
                    >
                      {t(wish.requestStatus)}
                    </span>
                  </div>
                </div>
              );
            })}

          {hasNextPage && (
            <div className="col-span-full flex justify-center items-center gap-2 py-6">
              <Button
                className="min-h-0 w-auto px-6 py-2.5 text-sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                loader={isFetchingNextPage}
              >
                {tProfile("loadMore") || "Load more"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

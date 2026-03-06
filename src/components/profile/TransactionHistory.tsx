import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTrancationList } from "@/hooks/profile/useTrancationList";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/images";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageLoader from "../common/PageLoader";

const TransactionHistory = () => {
  const { t } = useTranslation("profile");
  const [skip, setSkip] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const limit = 10;
  const { transactionList, totalCount, isLoading, isFetching, isError, error } =
    useTrancationList({ skip, limit });

  useEffect(() => {
    if (!transactionList || transactionList.length === 0) return;
    setItems((prev) => {
      if (skip === 0) {
        return transactionList;
      }
      return [...prev, ...transactionList];
    });
  }, [transactionList, skip]);

  const hasMore = totalCount > items.length;
  const initialLoading = isLoading && skip === 0 && items.length === 0;
  const loadingMore = isLoading && skip > 0;

  const handleLoadMore = () => {
    if (!hasMore || isLoading || isFetching) return;
    setSkip((prev) => prev + limit);
  };

  if (!items?.length && !isLoading && !isError) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        {t("noTransactions")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
        {(error as Error)?.message || "Failed to load transactions."}
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[500px]">
        <PageLoader duration={10000} />
      </div>
    );
  }

  return (
    <ScrollArea className="flex flex-col max-h-[calc(100vh-200px)]">
      <div className="flex flex-col gap-4 pr-2">
        {items.map((item, index) => (
          <div key={index} className="rounded-[16px] bg-[#F6F6F7] p-6 shrink-0">
            <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#98A1AB]">
              <div className="flex items-center gap-[18px]">
                <ImageCustom
                  alt={item.name}
                  src={item?.travellerDetails?.profile || DEFAULT_PROFILE_IMAGE}
                  className="size-[70px] rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-[20px] text-black">
                    {item.travellerDetails?.name}
                  </p>
                  <p className="font-normal text-base text-[#5C6268]">
                    {format(item?.createdAt, "dd MMM, yyyy")}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-[22px] text-[#F15E5E]">
                €{item?.amount?.toLocaleString()}
              </span>
            </div>
            {(() => {
              const rawRoutes =
                item?.availibilityDetails?.route &&
                Array.isArray(item.availibilityDetails.route)
                  ? item.availibilityDetails.route
                  : [];

              // Normalize each route point to a displayable string
              const routePoints = rawRoutes
                .map((p: any) => {
                  if (typeof p === "string") return p;
                  if (p && typeof p === "object") {
                    return p.location || p.mainLocation || p.name || "";
                  }
                  return "";
                })
                .filter((v: string) => v && v.trim().length > 0);

              const hasRoutes = routePoints.length > 0;
              const startRoute = hasRoutes ? routePoints[0] : item.startRoute;
              const endRoute =
                routePoints.length > 1
                  ? routePoints[routePoints.length - 1]
                  : hasRoutes
                    ? routePoints[0]
                    : item.endRoute;
              const middleRoutes =
                routePoints.length > 2
                  ? routePoints.slice(1, routePoints.length - 1)
                  : [];

              return (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-baseline gap-y-1 text-base">
                    <span className="whitespace-nowrap">
                      <span className="text-black font-medium text-lg">
                        {t("departure")}:{" "}
                      </span>
                      <span className="text-[#5C6268] font-light">
                        {format(
                          item?.availibilityDetails?.departureStartTime,
                          " MMM dd, yyyy, hh:mm a"
                        )}
                      </span>
                    </span>
                    <span className="mx-1 shrink-0 text-[#5C6268]">|</span>
                    <span className="whitespace-nowrap">
                      <span className="text-black font-medium text-lg">
                        {t("tourType")}:{" "}
                      </span>
                      <span className="text-[#5C6268] font-light">
                        {item?.availibilityDetails?.tourType[0] || "-"}
                      </span>
                    </span>
                    <span className="mx-1 shrink-0 text-[#5C6268]">|</span>
                    <span className="whitespace-nowrap">
                      <span className="text-black font-medium text-lg">
                        {t("charter")}:{" "}
                      </span>
                      <span className="text-[#5C6268] font-light">
                        {item?.craftDetails?.craftModel || "-"}
                      </span>
                    </span>
                    <span className="mx-1 shrink-0 text-[#5C6268]">|</span>
                    <span className="whitespace-nowrap">
                      <span className="text-black font-medium text-lg">
                        {t("seats")}:{" "}
                      </span>
                      <span className="text-[#5C6268] font-light">
                        {item.bookingDetails?.passengerInfo?.length || 0}
                      </span>
                    </span>
                  </div>
                  {startRoute && (
                    <div>
                      <span className="text-black font-medium text-lg">
                        {t("startRoute")}:{" "}
                      </span>
                      <span className="text-[#5C6268] text-base font-light">
                        {startRoute}
                      </span>
                    </div>
                  )}

                  {middleRoutes.length > 0 &&
                    middleRoutes.map((route: string, idx: number) => (
                      <div key={idx}>
                        <span className="text-black font-medium text-lg">
                          {t("route")} {idx + 1}:{" "}
                        </span>
                        <span className="text-[#5C6268] text-base font-light">
                          {route}
                        </span>
                      </div>
                    ))}

                  {endRoute && (
                    <div>
                      <span className="text-black font-medium text-lg">
                        {t("endRoute")}:{" "}
                      </span>
                      <span className="text-[#5C6268] text-base font-light">
                        {endRoute}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
        {(hasMore || loadingMore) && (
          <div className="flex justify-center items-center gap-2 pt-2 pb-2">
            <Button
              className="min-h-0 w-auto px-6 py-2.5 text-sm"
              onClick={handleLoadMore}
              disabled={loadingMore}
              loader={loadingMore}
            >
              {t("loadMore")}
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default TransactionHistory;

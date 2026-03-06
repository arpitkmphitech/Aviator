import Button from "@/components/common/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageCustom from "../common/Image";
import { useEffect, useState } from "react";
import { useCharterList } from "@/hooks/profile/useCharterList";
import PageLoader from "../common/PageLoader";
import { useTranslation } from "react-i18next";

const Charter = () => {
  const { t } = useTranslation("profile");
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const { charterList, totalCount, isLoading, isFetching, isError, error } =
    useCharterList({ skip, limit });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!charterList || charterList.length === 0) return;
    setItems((prev) => {
      if (skip === 0) {
        return charterList;
      }
      return [...prev, ...charterList];
    });
  }, [charterList, skip]);

  const hasMore = totalCount > items.length;
  const initialLoading = isLoading && skip === 0 && items.length === 0;
  const loadingMore = isLoading && skip > 0;

  const handleLoadMore = () => {
    if (!hasMore || isLoading) return;
    setSkip((prev) => prev + limit);
  };

  if (!items?.length && !isLoading && !isError) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No charters yet.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
        {(error as Error)?.message || "Failed to load charters."}
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
          <div
            key={index}
            className="rounded-[16px] bg-[#F6F6F7] p-6 shrink-0 border border-[#ECECED]"
          >
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-[#98A1AB]">
              <ImageCustom
                src={item.charterImage}
                alt={item.nameEn}
                className="size-[70px] rounded-full object-cover"
              />
              <p className="font-medium text-[20px] text-black">
                {localStorage.getItem("i18nextLng") === "en"
                  ? item.nameEn
                  : item.nameDe}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-black text-base font-normal">
                {item.plane}
              </span>
              <span className="text-black text-base font-normal">
                {item.capacity} {t("passengers")}
              </span>
              <span className="text-black text-base font-normal">
                {item.range} {t("nauticalMiles")}
              </span>
              <span className="text-black text-base font-normal">
                {item.speed} {t("mph")}
              </span>
              <span className="text-black text-base font-normal">
                €{item.price} {t("perHour")}
              </span>
            </div>
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
              Load more
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default Charter;

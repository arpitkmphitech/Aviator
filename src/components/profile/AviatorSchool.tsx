"use client";
import Button from "@/components/common/Button";
import ImageCustom from "@/components/common/Image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAviatorList } from "@/hooks/profile/useAviatorList";
import { useEffect, useState } from "react";
import PageLoader from "../common/PageLoader";
import { useTranslation } from "react-i18next";

const AviatorSchool = () => {
  const { t } = useTranslation("wishlist");
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const { aviatorList, totalCount, isLoading, isError, error } = useAviatorList(
    { skip, limit }
  );

  const [items, setItems] = useState<any[]>([]);

  // Append new page results when skip changes; reset list when we go back to first page
  useEffect(() => {
    if (!aviatorList || aviatorList.length === 0) return;

    setItems((prev) => {
      // First page → replace
      if (skip === 0) {
        return aviatorList;
      }

      // Append only if new data actually came
      const prevLength = prev.length;
      const newLength = aviatorList.length;

      // If API returned empty or same length, do nothing
      if (newLength === 0) return prev;

      return [...prev, ...aviatorList];
    });
  }, [aviatorList]);

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
        No aviator schools yet.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
        {(error as Error)?.message || "Failed to load aviator schools."}
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
        {items.map((item: any, index: number) => (
          <div
            key={index}
            className="rounded-[16px] bg-[#F6F6F7] p-6 shrink-0 border border-[#ECECED]"
          >
            <div className="flex items-center gap-4 pb-4 mb-4 border-b border-[#98A1AB]">
              <ImageCustom
                src={item.aviatorLogo}
                alt={item.instituteName}
                className="size-[70px] rounded-full object-cover"
              />
              <p className="font-medium text-[20px] text-black">
                {item.instituteName}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-black text-base font-normal">
                {item.address}
              </span>
              <span className="text-black text-base font-normal">
                {item.cCode} {item.phone}
              </span>
              <span className="text-black text-base font-normal">
                {item.email}
              </span>
              <span className="text-black text-base font-normal">
                {item.url}
              </span>
              <span className="text-black text-base font-normal">
                {item.experience} {t("years")}
              </span>
              <span className="text-black text-base font-normal">
                {item.description}
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

export default AviatorSchool;

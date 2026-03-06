"use client";

import ImageCustom from "@/components/common/Image";
import type { IPilotRatingItem } from "@/types/home";
import { ArrowLeft, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetPilotReviews from "@/hooks/home/useGetPilotReviews";
import Button from "../common/Button";
import moment from "moment";
import PageLoader from "../common/PageLoader";
import useScrollToTop from "@/hooks/useScrollToTop";

export function PilotReview() {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation("home");
  const { pilotId } = useParams<{ pilotId: string }>();
  const [skip, setSkip] = useState(0);
  const [accumulatedReviews, setAccumulatedReviews] = useState<
    IPilotRatingItem[]
  >([]);
  const lastMergedSkipRef = useRef(-1);
  const lastTotalRef = useRef(0);

  const { pilotReviews, total, isLoading, isFetching } = useGetPilotReviews({
    pilotId: pilotId ?? "",
    skip,
    limit: 10,
  });

  if (total > 0) {
    lastTotalRef.current = total;
  }

  useEffect(() => {
    if (!pilotReviews?.length && skip === 0) {
      lastMergedSkipRef.current = -1;
      setAccumulatedReviews((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    if (skip === 0) {
      lastMergedSkipRef.current = 0;
      setAccumulatedReviews(pilotReviews);
      return;
    }
    if (skip > lastMergedSkipRef.current && pilotReviews?.length) {
      lastMergedSkipRef.current = skip;
      setAccumulatedReviews((prev) => [...prev, ...pilotReviews]);
    }
  }, [skip, pilotReviews]);

  const totalRecords = total > 0 ? total : lastTotalRef.current;
  const hasMore = totalRecords > accumulatedReviews.length;
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
          <h1 className="text-[30px] font-medium text-black">{t("review")}</h1>
        </div>
      </div>
      {isLoading && skip === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <PageLoader />
        </div>
      ) : accumulatedReviews.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-[#6B7280] text-base">{t("noReviewsFound")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accumulatedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-[10px] p-[18px] flex flex-col"
              >
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 border-b border-[#ECECED] p-[15px] mb-5">
                  <div className="flex items-center gap-3">
                    <ImageCustom
                      src={review.travellerData?.profile ?? ""}
                      alt={review.travellerData?.name ?? ""}
                      className="size-12 rounded-full shrink-0"
                      width={48}
                      height={48}
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="font-medium text-[#2C2C2C] text-base">
                        {review.travellerData?.name}
                      </p>
                      <p className="text-sm text-[#6B7280]">
                        {moment(review.createdAt).format("DD MMM YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < review.rate
                              ? "fill-[#FFCC00] text-[#FFCC00]"
                              : "text-[#E5E7EB]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-base text-black">
                      {review.rate?.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-[#2C2C2C] text-base font-light leading-relaxed">
                  {review.feedback}
                </p>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                loader={isLoadingMore}
                disabled={isLoadingMore}
                className="max-h-8! w-fit"
                onClick={() => setSkip((s) => s + 10)}
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

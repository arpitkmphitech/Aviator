import { QUERY_KEYS } from "@/lib/constants";
import { getWishFlightOffers } from "@/services/wishlist.service";
import { useInfiniteQuery } from "@tanstack/react-query";

type WishFlightOfferParams = {
  wishFlightId: string;
  limit: number;
  search?: string;
  bidStatus?: string[];
  priceFilter?: "low_to_high" | "high_to_low";
};

export const useWishFlightOffer = (params: WishFlightOfferParams) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.WISHLIST_OFFER, params],
    queryFn: ({ pageParam = 0 }) =>
      getWishFlightOffers({
        ...params,
        skip: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const total = lastPage?.data?.totalRecords ?? 0;

      const loaded = pages.reduce(
        (acc, page) => acc + (page?.data?.list?.length ?? 0),
        0
      );

      if (loaded >= total) return undefined;

      return loaded;
    },
  });

  const wishFlightOffers =
    data?.pages.flatMap((page) => page?.data?.list ?? []) ?? [];

  const totalCount = data?.pages?.[0]?.data?.totalRecords ?? 0;

  return {
    wishFlightOffers,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};

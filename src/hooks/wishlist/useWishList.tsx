import { QUERY_KEYS } from "@/lib/constants";
import { getWishlist } from "@/services/wishlist.service";
import { useInfiniteQuery } from "@tanstack/react-query";

type WishListParams = {
  limit: number;
  search?: string;
  requestStatus?: string[];
};

export const useWishList = (params: WishListParams) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.WISHLIST, params],

    queryFn: ({ pageParam = 0 }) =>
      getWishlist({
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

  const wishList = data?.pages.flatMap((page) => page?.data?.list ?? []) ?? [];

  const totalCount = data?.pages?.[0]?.data?.totalRecords ?? 0;

  return {
    wishList,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};

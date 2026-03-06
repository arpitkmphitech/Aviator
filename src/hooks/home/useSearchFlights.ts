import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchAvailableFlights } from "@/services/home.service";
import type {
  IFlightAvailabilityItem,
  ISearchAvailableFlights,
} from "@/types/home";
import { useAuthStore } from "@/store/useAuthStore";

export function useSearchFlights() {
  const [flightResults, setFlightResults] = useState<IFlightAvailabilityItem[]>(
    []
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const { token } = useAuthStore();
  const [lastParams, setLastParams] = useState<Omit<
    ISearchAvailableFlights,
    "skip" | "limit"
  > | null>(null);

  const search = useCallback(
    async (params: Omit<ISearchAvailableFlights, "skip" | "limit">) => {
      if (!token) return [];
      setLoading(true);
      setLastParams(params);
      try {
        const payload: ISearchAvailableFlights = {
          ...params,
          skip: 0,
          limit: 12,
        };
        const res = await searchAvailableFlights(payload);
        const items: IFlightAvailabilityItem[] = res.data?.data ?? [];
        setFlightResults(items);
        setTotalRecords(res.data?.totalRecords ?? 0);
        return items;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const loadMore = useCallback(async () => {
    if (!token || !lastParams || loadMoreLoading) return;
    const currentLength = flightResults.length;
    if (currentLength >= totalRecords) return;

    setLoadMoreLoading(true);
    try {
      const payload: ISearchAvailableFlights = {
        ...lastParams,
        skip: currentLength,
        limit: 12,
      };
      const res = await searchAvailableFlights(payload);
      const nextList: IFlightAvailabilityItem[] = res.data?.data ?? [];
      setFlightResults((prev) => [...prev, ...nextList]);
    } finally {
      setLoadMoreLoading(false);
    }
  }, [token, lastParams, flightResults.length, totalRecords, loadMoreLoading]);

  const hasMore = flightResults.length < totalRecords;

  return {
    flightResults,
    totalRecords,
    loading,
    loadMoreLoading,
    hasMore,
    search,
    loadMore,
  };
}

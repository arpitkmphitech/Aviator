import { queryKeys } from "@/lib/constants";
import type {
  IFlightAvailabilityItem,
  IPilotRatings,
  ISearchAvailableFlightsResponse,
} from "@/types/home";
import type { IApiResponse } from "@/types/types";
import { getPilotUpcomingFlights } from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const useGetPilotUpcomingFlights = (params: IPilotRatings) => {
  const { data, isLoading, isFetching, isError, error } = useQuery<
    IApiResponse<ISearchAvailableFlightsResponse>
  >({
    queryKey: [queryKeys.pilotUpcomingFlights, params],
    queryFn: () => getPilotUpcomingFlights(params),
  });

  if (isError) {
    toast.error(error?.message);
  }

  return {
    upcomingFlights: (data?.data?.data ?? []) as IFlightAvailabilityItem[],
    total: data?.data?.totalRecords ?? 0,
    isLoading,
    isFetching,
  };
};

export default useGetPilotUpcomingFlights;

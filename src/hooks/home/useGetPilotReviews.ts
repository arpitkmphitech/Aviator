import { queryKeys } from "@/lib/constants";
import type { IPilotRatingItem, IPilotRatings } from "@/types/home";
import { useQuery } from "@tanstack/react-query";
import { getPilotRatings } from "@/services/home.service";
import { toast } from "sonner";

const useGetPilotReviews = (params: IPilotRatings) => {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [queryKeys.pilotReviews, params],
    queryFn: () => getPilotRatings(params),

  });

  if (isError) {
    toast.error(error?.message);
  }

  return {
    pilotReviews: (data?.data?.ratingList ?? []) as IPilotRatingItem[],
    total: data?.data?.totalRecords ?? 0,
    isLoading,
    isFetching,
  };
};

export default useGetPilotReviews;

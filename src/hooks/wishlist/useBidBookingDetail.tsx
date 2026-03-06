import { QUERY_KEYS } from "@/lib/constants";
import { getProposalDetails } from "@/services/wishlist.service";
import { useQuery } from "@tanstack/react-query";

export const useBidBookingDetail = (params: any) => {
  const { data, isLoading, isPending, isFetching, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.BID_BOOKING_DETAIL, params],
    queryFn: () => getProposalDetails(params),
    refetchOnMount: true,
  });
  return {
    bidBookingDetail: data?.data,
    isLoading: isLoading || isPending || isFetching,
    isError,
    error,
  };
};

import { getMyBookings } from "@/services/home.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import type { IMyBookings } from "@/types/home";
import { toast } from "sonner";

const useGetBookings = (params: IMyBookings) => {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [queryKeys.myBookings, params],
    queryFn: () => getMyBookings(params),
    refetchOnMount: "always",
  });

  if (isError) {
    toast.error(error?.message);
  }

  return {
    bookings: data?.data?.paginatedData ?? [],
    total: data?.data?.totalRecords ?? 0,
    isLoading,
    isFetching,
  };
};

export default useGetBookings;

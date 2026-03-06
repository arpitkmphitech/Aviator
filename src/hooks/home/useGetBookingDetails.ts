import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getBookingDetails } from "@/services/home.service";
import { toast } from "sonner";
import type { IBookingDetailsResponse } from "@/types/home";

const useGetBookingDetails = (bookingId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.bookingDetails, bookingId],
    queryFn: () => getBookingDetails(bookingId),
    enabled: !!bookingId,
    refetchOnMount: "always",
  });

  if (error) {
    toast.error((error as Error)?.message);
  }

  return {
    bookingDetails: (data?.data ?? null) as IBookingDetailsResponse | null,
    isLoading,
  };
};

export default useGetBookingDetails;

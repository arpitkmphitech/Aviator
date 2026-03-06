import { cancelBooking } from "@/services/home.service";
import { IApiResponse } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "@/lib/constants";

const useCancelBooking = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason: string;
    }) => cancelBooking(bookingId, reason),
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
      queryClient.refetchQueries({
        queryKey: [queryKeys.myBookings],
        exact: false,
      });
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });

  return { cancelBooking: mutateAsync, isPending };
};

export default useCancelBooking;

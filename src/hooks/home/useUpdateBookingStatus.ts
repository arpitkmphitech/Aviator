import { useMutation } from "@tanstack/react-query";
import { IApiResponse } from "@/types/types";
import { updateBookingStatus } from "@/services/home.service";
import { toast } from "sonner";

const useUpdateBookingStatus = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      bookingId,
      consent,
    }: {
      bookingId: string;
      consent: string;
    }) => updateBookingStatus(bookingId, consent),
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { updateBookingStatus: mutateAsync, isPending };
};

export default useUpdateBookingStatus;

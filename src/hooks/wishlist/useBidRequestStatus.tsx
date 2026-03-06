import { IApiResponse } from "@/types/types";
import { updateBidRequestStatus } from "@/services/wishlist.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBidRequestStatus = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: updateBidRequestStatus,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { updateBidRequestStatus: mutateAsync, isPending, data: data?.data };
};

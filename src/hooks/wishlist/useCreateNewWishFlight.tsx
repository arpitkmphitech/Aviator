import { createWishFlight } from "@/services/wishlist.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateNewWishFlight = () => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: createWishFlight,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { createNewWishFlight: mutateAsync, isPending, isError, error };
};

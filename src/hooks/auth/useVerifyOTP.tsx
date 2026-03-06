import { IApiResponse } from "@/types/types";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "@/services/auth.service";

export const useVerifyOTP = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { verifyOTP: mutateAsync, isPending, adminData: data?.data };
};

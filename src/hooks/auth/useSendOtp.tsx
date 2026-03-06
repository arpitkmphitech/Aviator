import { sendOtp } from "@/services/auth.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSendOtp = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: sendOtp,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { sendOtp: mutateAsync, isPending, adminData: data?.data };
};

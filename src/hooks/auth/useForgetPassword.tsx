import { forgetPassword } from "@/services/auth.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useForgetPassword = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: forgetPassword,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { forgetPassword: mutateAsync, isPending, adminData: data?.data };
};

export default useForgetPassword;

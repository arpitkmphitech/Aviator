import { resetPassword } from "@/services/auth.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResetPassword = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: IApiResponse) => {
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("token");
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { resetPassword: mutateAsync, isPending, adminData: data?.data };
};

import { changePassword } from "@/services/profile.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useChangePassword = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { changePassword: mutateAsync, isPending, data: data?.data };
};

export default useChangePassword;

import { registerUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useRegister = () => {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
      setToken(data?.data?.token);
      localStorage.setItem("user", JSON.stringify(data?.data));
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { register: mutateAsync, isPending, adminData: data?.data };
};

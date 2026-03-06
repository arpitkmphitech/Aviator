import { loginUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "../useUser";

const useLogin = () => {
  const { setToken } = useAuthStore();
  const { setUser } = useUser();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: IApiResponse) => {
      setToken(data?.data?.token);
      sessionStorage.setItem("user_id", data?.data?.userId);
      localStorage.setItem("i18nextLng", data?.data?.lang);
      setUser(data?.data);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { login: mutateAsync, isPending, adminData: data?.data };
};

export default useLogin;

import { updateLanguage, updateProfile } from "@/services/profile.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "../useUser";

export const useUpdateProfile = () => {
  const { setUser } = useUser();
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
      localStorage.setItem("i18nextLng", data?.data?.lang);
      setUser(data?.data);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { updateProfile: mutateAsync, isPending, data: data?.data };
};

export const useUpdateLanguage = () => {
  const { mutateAsync, isPending, data, variables } = useMutation({
    mutationFn: updateLanguage,
    onSuccess: (data: IApiResponse) => {
      localStorage.setItem("i18nextLng", variables?.lang ?? "en");
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { updateLanguage: mutateAsync, isPending, data: data?.data };
};

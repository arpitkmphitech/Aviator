import { contactUs } from "@/services/profile.service";
import { IApiResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useContactUs = () => {
  const { mutateAsync, isPending, data } = useMutation({
    mutationFn: contactUs,
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });
  return { contactUs: mutateAsync, isPending, data: data?.data };
};

export default useContactUs;

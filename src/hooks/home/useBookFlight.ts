import { bookFlight } from "@/services/home.service";
import { useMutation } from "@tanstack/react-query";
import { IApiResponse } from "@/types/types";
import { toast } from "sonner";

const useBookFlight = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: bookFlight,
    onSuccess: (data: IApiResponse) => {
      // toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });

  return { bookFlight: mutateAsync, isPending };
};

export default useBookFlight;

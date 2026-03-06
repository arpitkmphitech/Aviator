import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IApiResponse } from "@/types/types";
import { rateFlight } from "@/services/home.service";

interface RateFlightPayload {
  pilotId: string;
  bookingId: string;
  rating: number;
  feedback: string;
}

const useRateFlight = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ pilotId, bookingId, rating, feedback }: RateFlightPayload) =>
      rateFlight(pilotId, bookingId, rating, feedback),
    onSuccess: (data: IApiResponse) => {
      toast.success(data?.message);
    },
    onError: (error: IApiResponse) => {
      toast.error(error?.message);
    },
  });

  return { rateFlight: mutateAsync, isPending };
};

export default useRateFlight;

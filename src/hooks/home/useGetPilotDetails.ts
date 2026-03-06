import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";
import { getUserDetails } from "@/services/auth.service";

const useGetPilotDetails = (pilotId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.pilotDetails, pilotId],
    queryFn: () => getUserDetails({ userId: pilotId }),
    enabled: !!pilotId,
  });

  if (error) {
    toast.error(error?.message);
  }

  return { pilotDetails: data?.data ?? {}, isLoading };
};

export default useGetPilotDetails;

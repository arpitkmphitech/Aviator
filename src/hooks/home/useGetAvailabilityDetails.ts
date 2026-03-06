import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getAvailabilityDetails } from "@/services/home.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useGetAvailabilityDetails = (availabilityId: string,enabled: boolean) => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.availabilityDetails, availabilityId],
    queryFn: () => getAvailabilityDetails(availabilityId),
    enabled: !!availabilityId && enabled,
    refetchOnMount: "always",
  });

  if (error) {
    toast.error(error?.message);
    router.push("/home");
  }

  return { availabilityDetails: data?.data ?? {}, isLoading };
};

export default useGetAvailabilityDetails;

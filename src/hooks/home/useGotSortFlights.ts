import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { getSortFlightList } from "@/services/home.service";
import { toast } from "sonner";

const useGotSortFlights = (enabled: boolean) => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [queryKeys.sortFlightList],
    queryFn: () => getSortFlightList(),
    enabled: enabled,
  });

  if (isError) {
    toast.error(error?.message);
  }

  return { sortFlightList: data?.data ?? {}, isLoading, error, isError };
};

export default useGotSortFlights;

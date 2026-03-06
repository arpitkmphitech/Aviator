import { getLuggageList } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import { toast } from "sonner";

const useGetLuggageList = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryKeys.luggageList],
    queryFn: getLuggageList,
  });

  if (isError) {
    toast.error(error?.message);
  }

  return { luggageList: data?.data?.list ?? [], isLoading };
};

export default useGetLuggageList;

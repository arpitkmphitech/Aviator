import { QUERY_KEYS } from "@/lib/constants";
import { getAviatorList } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";

type AviatorListParams = {
  skip: number;
  limit: number;
};

export const useAviatorList = ({ skip, limit }: AviatorListParams) => {
  const params = { skip, limit };

  const { data, isLoading, isPending, isFetching, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.AVAITER_LIST, skip, limit],
    queryFn: () => getAviatorList(params),
  });

  return {
    aviatorList: data?.data?.paginatedData || [],
    totalCount: data?.data?.totalRecords || 0,
    isLoading: isLoading || isPending || isFetching,
    isError,
    error,
  };
};

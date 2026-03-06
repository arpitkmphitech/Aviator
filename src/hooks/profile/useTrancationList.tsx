import { QUERY_KEYS } from "@/lib/constants";
import { getTransactionHistory } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";
import type { IApiResponse } from "@/types/types";

type TransactionListParams = {
  skip: number;
  limit: number;
};

export const useTrancationList = ({ skip, limit }: TransactionListParams) => {
  const params = { skip, limit };

  const { data, isLoading, isPending, isFetching, isError, error } = useQuery<
    IApiResponse<any>,
    Error
  >({
    queryKey: [QUERY_KEYS.TRANSACTION_HISTORY, skip, limit],
    queryFn: () => getTransactionHistory(params),
  });

  const safeData = (data as IApiResponse<any>) || { data: {} as any };

  return {
    transactionList: safeData.data?.totalData || [],
    totalCount: safeData.data?.totalRecords || 0,
    isLoading: isLoading || isPending,
    isFetching,
    isError,
    error,
  };
};

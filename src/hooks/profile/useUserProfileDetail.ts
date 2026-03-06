import { QUERY_KEYS } from "@/lib/constants";
import { getUserDetails } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useUserProfileDetail = (enabled: boolean) => {
  const { data, isPending, isLoading, isFetching, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE_DETAIL],
    refetchOnMount: true,
    enabled: enabled,
    queryFn: () =>
      getUserDetails({ userId: sessionStorage.getItem("user_id") || "" }),
  });
  return {
    userProfileDetail: data?.data,
    isLoading: isLoading || isPending,
    isFetching,
    isError,
    error,
  };
};

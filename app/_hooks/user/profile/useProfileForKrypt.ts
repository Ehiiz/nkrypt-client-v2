import useSWR from "swr";
import { fetchUser } from "../../fetcher";

export const useSearchProfile = ({ query }: { query: string }) => {
  // Only fetch when query has content
  const shouldFetch = query && query.trim().length > 0;
  
  const { data, error, isValidating, mutate } = useSWR(
    shouldFetch ? `/profile/search?username=${encodeURIComponent(query)}` : null,
    fetchUser
  );

  const searchLoading = shouldFetch && !data && !error;
  
  const serachProfile:
    | { username: string; profileImage: string; id: string }[]
    | undefined = data || [];
    
  return {
    serachProfile,
    error,
    searchLoading,
    isValidating,
    mutateSearch: mutate,
  };
};
import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IKryptsReponse } from "./krypt.interface";

export const useKrypts = (page = 1, search = "") => {
  // Build query string with search and pagination
  const queryString = new URLSearchParams();
  if (search) queryString.append("search", search);
  queryString.append("page", page.toString());

  const endpoint = `/krypt?${queryString.toString()}`;

  const { data, error, isValidating, mutate } = useSWR(endpoint, fetchUser);

  const kryptsLoading = !data && !error;

  const response: IKryptsReponse | undefined = data;
  const { krypts = [], ...pagination } = response || {
    krypts: [],
    total: 0,
    page: 1,
    totalPages: 1,
  };

  return {
    krypts,
    pagination,
    error,
    kryptsLoading,
    isValidating,
    mutateKrypts: mutate,
  };
};

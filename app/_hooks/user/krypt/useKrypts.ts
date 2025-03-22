import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IKryptsReponse } from "./krypt.interface";

export const useKrypts = () => {
  const { data, error, isValidating, mutate } = useSWR("/krypt", fetchUser);

  const kryptLoading = !data && !error;

  const response: IKryptsReponse | undefined = data;
  const { krypts = [], ...pagination } = response || { krypts: [] };
  return {
    krypts,
    pagination,
    error,
    kryptLoading,
    isValidating,
    mutateKrypts: mutate,
  };
};

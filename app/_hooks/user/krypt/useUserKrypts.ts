import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IKryptsReponse } from "./krypt.interface";

export const useUserKrypts = ({ draft = false }: { draft: boolean }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/krypt/user?draft=${draft}`,
    fetchUser
  );

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

import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IKryptsReponse } from "./krypt.interface";

export const useUserKrypts = ({
  draft = false,
  dekrypt = false,
}: {
  draft?: boolean;
  dekrypt?: boolean;
}) => {
  const url = dekrypt ? "/krypt/user/dekrypts" : `/krypt/user?draft=${draft}`;
  const { data, error, isValidating, mutate } = useSWR(url, fetchUser);

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

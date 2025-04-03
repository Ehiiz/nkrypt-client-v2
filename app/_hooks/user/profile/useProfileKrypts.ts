import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IKryptsReponse } from "../krypt/krypt.interface";

export const useProfileKrypts = ({
  draft = false,
  dekrypt = false,
  id,
}: {
  draft?: boolean;
  dekrypt?: boolean;
  id: string;
}) => {
  const url = dekrypt
    ? `/krypt/profile/dekrypts/${id}`
    : `/krypt/profile/${id}?draft=${draft}`;
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

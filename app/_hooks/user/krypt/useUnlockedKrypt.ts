import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IResponseFormattedUnlockedKrypt } from "./krypt.interface";

export const useUnlockedKrypts = ({ id }: { id: string }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/krypt/${id}`,
    fetchUser
  );

  const kryptLoading = !data && !error;
  const kryptData:
    | { krypt: IResponseFormattedUnlockedKrypt; allowed: boolean }
    | undefined = data;

  return {
    krypt: kryptData?.krypt,
    allowed: kryptData?.allowed,
    error,
    kryptLoading,
    isValidating,
    mutateUnlockedKrypts: mutate,
  };
};

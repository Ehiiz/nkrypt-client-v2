import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IReponseFormattedKrypt } from "./krypt.interface";

export const useKryptDetials = ({ id }: { id: string }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/krypt/${id}/details`,
    fetchUser
  );

  const kryptDetailLoading = !data && !error;
  const kryptData: { krypt: IReponseFormattedKrypt } | undefined = data;

  return {
    kryptDetail: kryptData?.krypt,
    error,
    kryptDetailLoading,
    isValidating,
    mutateKryptDetails: mutate,
  };
};

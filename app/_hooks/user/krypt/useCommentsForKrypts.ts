import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IComment } from "./krypt.interface";

export const useCommentsForKrypts = ({ id }: { id: string }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/krypt/${id}`,
    fetchUser
  );

  const kryptLoading = !data && !error;
  const comments: IComment[] | undefined = data;

  return {
    comments,
    error,
    kryptLoading,
    isValidating,
    mutateComments: mutate,
  };
};

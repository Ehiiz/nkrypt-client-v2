import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IProfile } from "./profile.interface";

export const useUserProfile = ({ id }: { id: string }) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/profile/${id}`,
    fetchUser
  );

  const profileLoading = !data && !error;

  const profile: IProfile | undefined = data;
  return {
    profile,
    error,
    profileLoading,
    isValidating,
    mutateUserProfile: mutate,
  };
};

import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IProfile } from "./profile.interface";

export const useProfile = () => {
  const { data, error, isValidating, mutate } = useSWR(`/profile`, fetchUser);

  const profileLoading = !data && !error;

  const profile: IProfile | undefined = data;
  return {
    profile,

    error,
    profileLoading,
    isValidating,
    mutateCurrentProfile: mutate,
  };
};

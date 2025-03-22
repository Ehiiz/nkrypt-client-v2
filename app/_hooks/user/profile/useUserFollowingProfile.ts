import useSWR from "swr";
import { fetchUser } from "../../fetcher";
import { IMiniProfile } from "./profile.interface";

export const useUserFollowingProfile = ({
  id,
  type,
}: {
  id: string;
  type: "following" | "followers";
}) => {
  const { data, error, isValidating, mutate } = useSWR(
    `/profile/${id}/${type}`,
    fetchUser
  );

  const profileLoading = !data && !error;

  const users: { users: IMiniProfile[] } | undefined = data;
  return {
    users,
    error,
    profileLoading,
    isValidating,
    mutateUserProfile: mutate,
  };
};

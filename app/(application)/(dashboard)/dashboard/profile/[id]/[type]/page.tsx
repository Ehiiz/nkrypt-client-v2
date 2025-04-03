/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useUserFollowingProfile } from "@/app/_hooks/user/profile/useUserFollowingProfile";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UserPlus, UserCheck, ArrowLeft } from "lucide-react";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { UserProfileHook } from "@/app/_hooks/user/profile/profile.hook";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import Link from "next/link";
import { IMiniProfile } from "@/app/_hooks/user/profile/profile.interface";

const UserCard = ({
  user,
  onFollowToggle,
}: {
  user: IMiniProfile;
  onFollowToggle: (userId: string, follow: boolean) => Promise<void>;
}) => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const router = useRouter();

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsUpdating(true);
      await onFollowToggle(user._id, !user.isFollowing);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => router.push(`/profile/${user._id}`)}
      className="flex items-center justify-between p-4 bg-[#222227] rounded-lg hover:bg-[#2A2A30] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={user.profileImage || "/placeholder-avatar.png"}
            alt={user.username}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-[#B2F17E] font-semibold">{user.username}</p>
          <p className="text-gray-300 text-sm line-clamp-1">{user.bio}</p>
          {user.followingUs && !user.isCurrentUser && (
            <span className="text-xs text-gray-400">Follows you</span>
          )}
        </div>
      </div>

      {!user.isCurrentUser && (
        <button
          onClick={handleFollow}
          disabled={isUpdating}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            user.isFollowing
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-[#6558C8] hover:bg-[#5449B3] text-white"
          }`}
        >
          {isUpdating ? (
            "..."
          ) : user.isFollowing ? (
            <>
              <UserCheck size={16} />
              <span className="hidden sm:inline">Unfollow</span>
            </>
          ) : (
            <>
              <UserPlus size={16} />
              <span className="hidden sm:inline">Follow</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

function FollowerAndFollowing() {
  const params: { id: string; type: "following" | "followers" } = useParams();
  const router = useRouter();
  const { users, error, isValidating, mutateUserProfile } =
    useUserFollowingProfile({
      id: params.id,
      type: params.type,
    });

  const [localUsers, setLocalUsers] = React.useState<IMiniProfile[]>([]);

  React.useEffect(() => {
    if (users) {
      setLocalUsers(users.users);
    }
  }, [users]);

  const handleFollowToggle = async (userId: string, follow: boolean) => {
    try {
      await UserProfileHook.followOrUnfollowUser({
        id: userId,
        follow,
      });

      // Update local state
      setLocalUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isFollowing: follow } : user
        )
      );

      // Refresh data
      mutateUserProfile();

      toastAlert({
        message: follow ? "Followed successfully" : "Unfollowed successfully",
        type: ToastType.success,
      });
    } catch (error) {
      toastAlert({
        message: "Error updating follow status",
        type: ToastType.error,
      });
    }
  };

  const pageTitle = params.type === "followers" ? "Followers" : "Following";

  return (
    <div className="flex flex-col min-h-screen bg-[#222227] text-white">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-800">
        <button
          onClick={() => router.back()}
          className="mr-4 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-lg font-medium">{pageTitle}</div>
        <div className="ml-auto text-[#B2F17E] font-bold text-xl">NKRYPT</div>
      </header>

      {/* Content */}
      <div className="flex-1 bg-[#1A1A1F] p-4">
        {isValidating && !users ? (
          <div className="flex justify-center p-6 text-gray-400">
            Loading...
          </div>
        ) : error ? (
          <div className="flex justify-center p-6 text-red-400">
            Error loading users
          </div>
        ) : localUsers && localUsers.length > 0 ? (
          <div className="space-y-3 max-w-3xl mx-auto">
            {localUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-gray-400">
            <p className="text-lg mb-4">No {pageTitle.toLowerCase()} found</p>
            <Link
              href="/explore"
              className="px-4 py-2 bg-[#6558C8] hover:bg-[#5449B3] rounded-lg text-white transition-colors"
            >
              Explore users
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default authUserWrapper(FollowerAndFollowing);

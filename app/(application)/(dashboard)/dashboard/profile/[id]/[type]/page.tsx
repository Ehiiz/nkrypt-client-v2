// app/dashboard/profile/[id]/[type]/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useUserFollowingProfile } from "@/app/_hooks/user/profile/useUserFollowingProfile";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { UserPlus, UserCheck, ArrowLeft, Loader2 } from "lucide-react";
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
      onClick={() => router.push(`/dashboard/profile/${user._id}`)}
      className="flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 shadow-md flex-shrink-0">
          <Image
            src={user.profileImage || "/placeholder-avatar.png"}
            alt={user.username}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 truncate">
            {user.username}
          </p>
          <p className="text-slate-300 text-sm line-clamp-1">{user.bio}</p>
          {user.followingUs && !user.isCurrentUser && (
            <span className="text-xs text-emerald-400 font-medium">
              Follows you
            </span>
          )}
        </div>
      </div>

      {!user.isCurrentUser && (
        <button
          onClick={handleFollow}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md
            ${
              isUpdating
                ? "bg-slate-700/60 text-slate-400 cursor-wait"
                : user.isFollowing
                ? "bg-slate-700/60 text-white hover:bg-slate-600/60"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105"
            }`}
        >
          {isUpdating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : user.isFollowing ? (
            <>
              <UserCheck size={16} />
              Unfollow
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Follow
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
      setLocalUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isFollowing: follow } : user
        )
      );
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center px-4 py-3 sm:px-6 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {pageTitle}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 relative z-10">
        {isValidating && !users ? (
          <div className="flex justify-center p-6 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center p-6 text-red-400">
            Error loading users.
          </div>
        ) : localUsers && localUsers.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {localUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 text-slate-400 text-center max-w-sm mx-auto">
            <p className="text-lg font-semibold mb-4">
              No {pageTitle.toLowerCase()} found.
            </p>
            <Link
              href="/dashboard/explore"
              className="group relative overflow-hidden px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
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

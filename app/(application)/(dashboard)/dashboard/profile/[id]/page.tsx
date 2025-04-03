/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
  Settings,
  MessageCircle,
  ThumbsUp,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { IReponseFormattedKrypt } from "@/app/_hooks/user/krypt/krypt.interface";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import ProfileCard from "@/app/_components/cards/profileCard";
import { useUserProfile } from "@/app/_hooks/user/profile/useUserProfile";
import { useProfileKrypts } from "@/app/_hooks/user/profile/useProfileKrypts";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { UserProfileHook } from "@/app/_hooks/user/profile/profile.hook";

// KryptList Component
const KryptList = ({
  krypts,
  isLoading,
}: {
  krypts: IReponseFormattedKrypt[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex justify-center p-6 text-gray-400">Loading...</div>
    );
  }

  if (krypts.length === 0) {
    return (
      <div className="flex justify-center p-6 text-gray-400">
        No krypts found
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3">
      {krypts.map((krypt, index) => (
        <div
          onClick={() =>
            router.push(`/dashboard/krypt/${krypt.id || krypt._id}/unlock`)
          }
          key={krypt._id || krypt.id}
          className="bg-[#222227] cursor-pointer rounded-lg p-4 transition-all hover:bg-[#2A2A30]"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={krypt.creatorImage || "/placeholder-avatar.png"}
                alt={krypt.creatorName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[#B2F17E] font-semibold">
                {krypt.creatorName}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M16 2V6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 2V6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {new Date(krypt.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 6V12L16 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {new Date(krypt.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <h3 className="text-white font-bold text-lg mb-1">{krypt.title}</h3>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
            {krypt.description}
          </p>

          <div className="flex justify-between text-xs">
            <div className="flex gap-4">
              <span className="text-[#B2F17E] flex items-center gap-1">
                <MessageCircle size={14} />
                {krypt.commentCount} comments
              </span>
              <span className="text-[#B2F17E] flex items-center gap-1">
                <ThumbsUp size={14} />
                {krypt.successCount || 0} unkrypts
              </span>
            </div>
            <span className="text-gray-400 bg-[#2A2A30] px-2 py-1 rounded">
              {krypt.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

function ProfilePage() {
  const params: { id: string } = useParams();
  const { profile, profileLoading, mutateUserProfile } = useUserProfile({
    id: params.id,
  });
  const [activeTab, setActiveTab] = React.useState<"mykrypts" | "dekrypts">(
    "mykrypts"
  );
  const [isFollowing, setIsFollowing] = React.useState<boolean>(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (profile) {
      setIsFollowing(profile.isFollowing || false);
    }
  }, [profile]);

  // Fetch user's krypts
  const {
    krypts: myKrypts,
    kryptLoading: myKryptsLoading,
    error: myKryptsError,
  } = useProfileKrypts({ draft: false, id: params.id });

  // Fetch user's dekrypts (using the same hook but we'd need to adjust the endpoint in a real implementation)
  const {
    krypts: myDekrypts,
    kryptLoading: myDekryptsLoading,
    error: myDekryptsError,
  } = useProfileKrypts({ dekrypt: true, id: params.id }); // In reality, this would have a different endpoint or param

  const handleFollowUser = async () => {
    try {
      setIsUpdating(true);
      await UserProfileHook.followOrUnfollowUser({
        id: params.id,
        follow: !isFollowing,
      });

      setIsFollowing(!isFollowing);
      // Update the profile data to reflect the new follower status
      mutateUserProfile();

      toastAlert({
        message: isFollowing
          ? "Unfollowed successfully"
          : "Followed successfully",
        type: ToastType.success,
      });
    } catch (error) {
      toastAlert({
        message: "Error updating follow status",
        type: ToastType.error,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#222227] text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="text-lg font-medium">Profile</div>
        <div className="text-[#B2F17E] font-bold text-xl">NKRYPT</div>
      </header>

      {/* Profile Info */}
      <div className="relative">
        <ProfileCard
          followersCount={profile?.followersCount}
          followingCount={profile?.followingCount}
          profileImage={profile?.profileImage}
          bio={profile?.bio}
          username={profile?.username}
          kryptCount={myKrypts.length}
          profileId={profile!._id}
        />

        {/* Follow Button - Show only if not current user */}
        {profile && !profile.isCurrentUser && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleFollowUser}
              disabled={isUpdating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-[#6558C8] hover:bg-[#5449B3] text-white"
              }`}
            >
              {isUpdating ? (
                "Processing..."
              ) : isFollowing ? (
                <>
                  <UserCheck size={18} />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Follow
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1A1A1F]  rounded-t-xl overflow-hidden sticky top-0 z-10">
        <button
          className={`flex-1 py-4 font-medium text-center transition-colors ${
            activeTab === "mykrypts"
              ? "bg-[#6558C8] text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("mykrypts")}
        >
          My Krypts
        </button>
        <button
          className={`flex-1 py-4 font-medium text-center transition-colors ${
            activeTab === "dekrypts"
              ? "bg-[#6558C8] text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("dekrypts")}
        >
          Dekrypts
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-full bg-[#1A1A1F]">
        {activeTab === "mykrypts" ? (
          <KryptList krypts={myKrypts || []} isLoading={myKryptsLoading} />
        ) : (
          <KryptList krypts={myDekrypts || []} isLoading={myDekryptsLoading} />
        )}
      </div>
    </div>
  );
}

export default authUserWrapper(ProfilePage);

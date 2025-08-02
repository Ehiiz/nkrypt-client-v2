/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
  Settings,
  MessageCircle,
  ThumbsUp,
  UserPlus,
  UserCheck,
  Calendar,
  Clock,
  Hash,
  Users,
  Zap,
  Star,
  Unlock,
  Eye,
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
import Link from "next/link";

// Modern KryptCard Component
const KryptCard = ({
  krypt,
  index,
}: {
  krypt: IReponseFormattedKrypt;
  index: number;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(`/dashboard/krypt/${krypt.id || krypt._id}/unlock`)
      }
      className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-sm border border-slate-600/30 hover:border-purple-400/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500"></div>
      </div>

      {/* Type badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 px-3 py-1 rounded-full">
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">
            {krypt.type}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        {/* Creator info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400/30 shadow-lg">
              <Image
                src={krypt.creatorImage || "/placeholder-avatar.png"}
                alt={krypt.creatorName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="flex-1">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-sm">
              {krypt.creatorName}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
                <Calendar size={10} />
                {new Date(krypt.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 bg-slate-700/50 px-2 py-1 rounded-full">
                <Clock size={10} />
                {new Date(krypt.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h3 className="text-white font-bold text-xl mb-2 group-hover:text-purple-100 transition-colors">
            {krypt.title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
            {krypt.description}
          </p>
        </div>

        {/* Tags section */}
        {krypt.tags && krypt.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {krypt.tags.slice(0, 3).map((tag) => (
                <Link
                  href={`/dashboard/profile/${tag.id}`}
                  key={tag.id}
                  className="group/tag flex items-center bg-gradient-to-r from-slate-700/60 to-slate-600/60 backdrop-blur-sm border border-slate-500/30 hover:border-purple-400/50 rounded-full px-3 py-1.5 transition-all duration-200 hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-slate-400/30">
                    <Image
                      src={tag.profileImage || "/placeholder-avatar.png"}
                      alt={tag.username}
                      width={20}
                      height={20}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-xs text-slate-300 group-hover/tag:text-purple-300 font-medium">
                    @{tag.username}
                  </span>
                </Link>
              ))}
              {krypt.tags.length > 3 && (
                <div className="flex items-center bg-slate-700/40 rounded-full px-3 py-1.5">
                  <span className="text-xs text-slate-400 font-medium">
                    +{krypt.tags.length - 3} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats section */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 bg-slate-700/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle size={12} className="text-white" />
              </div>
              <span className="text-blue-400 text-xs font-semibold">
                {krypt.commentCount}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-700/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <Unlock size={12} className="text-white" />
              </div>
              <span className="text-emerald-400 text-xs font-semibold">
                {krypt.successCount || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <Eye
              size={14}
              className="text-slate-400 group-hover:text-purple-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern KryptList Component
const KryptList = ({
  krypts,
  isLoading,
}: {
  krypts: IReponseFormattedKrypt[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animate-reverse animation-delay-150"></div>
        </div>
        <p className="mt-4 text-sm font-medium">Loading krypts...</p>
      </div>
    );
  }

  if (krypts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
          <Hash size={32} className="text-slate-500" />
        </div>
        <p className="text-lg font-semibold text-slate-300 mb-2">
          No krypts found
        </p>
        <p className="text-sm text-center max-w-sm">
          This user hasn&apos;t created any krypts yet. Check back later for new
          content!
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-40 h-40 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {krypts.map((krypt, index) => (
          <KryptCard key={krypt._id || krypt.id} krypt={krypt} index={index} />
        ))}
      </div>
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

  // Fetch user's dekrypts
  const {
    krypts: myDekrypts,
    kryptLoading: myDekryptsLoading,
    error: myDekryptsError,
  } = useProfileKrypts({ dekrypt: true, id: params.id });

  const handleFollowUser = async () => {
    try {
      setIsUpdating(true);
      await UserProfileHook.followOrUnfollowUser({
        id: params.id,
        follow: !isFollowing,
      });

      setIsFollowing(!isFollowing);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header with glassmorphism */}
      <header className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-pink-600/5"></div>
        <div className="relative flex justify-between items-center p-6">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
            Profile
          </div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-2xl">
            NKRYPT
          </div>
        </div>
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
          profileId={params.id}
          walletAddress={profile?.walletAddress || ""}
          balance={profile?.balance || "0"}
          isCurrentUser={profile?.isCurrentUser || false}
          id={params.id}
        />

        {/* Modern Follow Button */}
        {profile && !profile.isCurrentUser && (
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={handleFollowUser}
              disabled={isUpdating}
              className={`group relative overflow-hidden font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isFollowing
                  ? "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white hover:shadow-slate-500/25"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-purple-500/25"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2">
                {isUpdating ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isFollowing ? (
                  <UserCheck size={18} />
                ) : (
                  <UserPlus size={18} />
                )}
                <span>
                  {isUpdating
                    ? "Processing..."
                    : isFollowing
                    ? "Unfollow"
                    : "Follow"}
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Modern Tabs */}
      <div className="relative bg-slate-800/60 backdrop-blur-sm border-b border-slate-600/30 sticky top-0 z-30">
        <div className="flex">
          <button
            className={`relative flex-1 py-4 font-semibold text-center transition-all duration-300 ${
              activeTab === "mykrypts"
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => setActiveTab("mykrypts")}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Hash size={18} />
              My Krypts
            </span>
            {activeTab === "mykrypts" && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl transition-all duration-300"></div>
            )}
          </button>
          <button
            className={`relative flex-1 py-4 font-semibold text-center transition-all duration-300 ${
              activeTab === "dekrypts"
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
            onClick={() => setActiveTab("dekrypts")}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Unlock size={18} />
              Dekrypts
            </span>
            {activeTab === "dekrypts" && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-xl transition-all duration-300"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm">
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MessageCircle,
  Star,
  Clock,
  User,
  Zap,
  Trophy,
  Lock,
  Unlock,
  Eye,
  Crown,
} from "lucide-react";
import { IReponseFormattedKrypt } from "@/app/_hooks/user/krypt/krypt.interface";
import { useRouter } from "next/navigation";

export function KryptCard({
  id,
  title,
  description,
  successCount,
  failureCount,
  commentCount,
  type,
  createdAt,
  isOwner,
  isDekrypted,
  hasAccess,
  creatorName,
  creatorId,
  creatorImage,
  tags,
  maxWinners,
  prizePool,
}: IReponseFormattedKrypt) {
  const router = useRouter();
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  const getStatusInfo = () => {
    if (isDekrypted)
      return {
        color: "from-emerald-500 to-green-600",
        text: "Dekrypted",
        icon: <Unlock size={12} className="text-white" />,
        bgColor: "bg-emerald-500/20",
        borderColor: "border-emerald-400/50",
      };
    if (hasAccess)
      return {
        color: "from-amber-500 to-orange-600",
        text: "Access Granted",
        icon: <Eye size={12} className="text-white" />,
        bgColor: "bg-amber-500/20",
        borderColor: "border-amber-400/50",
      };
    return {
      color: "from-slate-600 to-slate-700",
      text: "Locked",
      icon: <Lock size={12} className="text-white" />,
      bgColor: "bg-slate-500/20",
      borderColor: "border-slate-400/50",
    };
  };

  const statusInfo = getStatusInfo();
  const hasRewards = prizePool && prizePool > 0;
  const rewardPerWinner = hasRewards && maxWinners ? prizePool / maxWinners : 0;

  return (
    <div onClick={() => router.push(`/dashboard/krypt/${id}`)}>
      <div className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] p-2 sm:p-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 backdrop-blur-sm border border-slate-600/30 hover:border-purple-400/50 rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl group-hover:from-purple-400/10 group-hover:to-pink-400/10 transition-all duration-500"></div>
            <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-2xl group-hover:from-blue-400/8 group-hover:to-cyan-400/8 transition-all duration-500"></div>
          </div>

          {/* Status indicator bar */}
          <div
            className={`h-1 w-full bg-gradient-to-r ${statusInfo.color} rounded-t-3xl`}
          />

          {/* Header section */}
          <div className="relative z-10 p-4 sm:p-6 pb-2 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Status badge */}
                <div
                  className={`flex items-center gap-1.5 ${statusInfo.bgColor} backdrop-blur-sm border ${statusInfo.borderColor} rounded-full px-2 sm:px-3 py-1 sm:py-1.5`}
                >
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${statusInfo.color} rounded-full flex items-center justify-center`}
                  >
                    {statusInfo.icon}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {statusInfo.text}
                  </span>
                </div>

                {/* Owner badge */}
                {isOwner && (
                  <div className="flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-sm border border-amber-400/50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Crown size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-amber-400">
                      Owner
                    </span>
                  </div>
                )}

                {/* Rewards badge */}
                {hasRewards && (
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                      <Trophy size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      Rewarded
                    </span>
                  </div>
                )}
              </div>

              {/* Type badge */}
              <div className="bg-slate-700/60 backdrop-blur-sm border border-slate-500/30 rounded-full px-2 py-1">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {type}
                </span>
              </div>
            </div>

            {/* Title and description */}
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200 group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 line-clamp-2">
                {title}
              </h3>
              {description && (
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {description}
                </p>
              )}
            </div>

            {/* Reward info section */}
            {hasRewards && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-3 sm:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                      <Trophy size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Reward Pool
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-emerald-400">
                    {prizePool} ADA
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Max Winners: {maxWinners}</span>
                  <span className="font-medium">
                    ~{rewardPerWinner.toFixed(2)} ADA each
                  </span>
                </div>
              </div>
            )}

            {/* Tags section */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map((tag) => (
                  <Link
                    href={`/dashboard/profile/${tag.id}`}
                    key={tag.id}
                    className="group/tag flex items-center bg-slate-700/40 backdrop-blur-sm border border-slate-500/30 hover:border-purple-400/50 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 hover:shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden mr-1 sm:mr-2 border border-slate-400/30">
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
                {tags.length > 3 && (
                  <div className="flex items-center bg-slate-700/40 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                    <span className="text-xs text-slate-400 font-medium">
                      +{tags.length - 3} more
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats section */}
          <div className="relative z-10 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-600/30 bg-slate-800/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* This is the new, more flexible wrapper for the count badges */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Success count */}
                <div className="flex items-center gap-1 bg-emerald-500/20 rounded-full px-2 py-1.5">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {successCount}
                  </span>
                </div>

                {/* Failure count */}
                <div className="flex items-center gap-1 bg-red-500/20 rounded-full px-2 py-1.5">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <XCircle size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-400">
                    {failureCount}
                  </span>
                </div>

                {/* Comment count */}
                <div className="flex items-center gap-1 bg-blue-500/20 rounded-full px-2 py-1.5">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-400">
                    {commentCount}
                  </span>
                </div>

                {/* Reward indicator, hidden on small screens */}
                {hasRewards && (
                  <div className="hidden sm:flex items-center gap-1 bg-amber-500/20 rounded-full px-2 py-1.5">
                    <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                      <Star size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-semibold text-amber-400">
                      {prizePool}₳
                    </span>
                  </div>
                )}
              </div>

              {/* This is the now-separate time badge */}
              <div className="flex items-center gap-1.5 bg-slate-600/40 rounded-full px-2 sm:px-3 py-1.5 ml-2">
                <Clock size={12} className="text-slate-400" />
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Creator info */}
          <div className="relative z-10 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-600/30 bg-slate-800/60 backdrop-blur-sm rounded-b-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 ${statusInfo.borderColor} shadow-lg`}
                  >
                    {creatorImage ? (
                      <Image
                        src={creatorImage}
                        alt={creatorName || "Creator"}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {creatorName || "Anonymous"}
                  </p>
                  <p className="text-xs text-slate-400">Creator</p>
                </div>
              </div>

              {/* Additional reward info for mobile */}
              {hasRewards && (
                <div className="text-right sm:hidden">
                  <div className="text-sm font-bold text-emerald-400">
                    {prizePool} ADA
                  </div>
                  <div className="text-xs text-slate-400">
                    {maxWinners} winners
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

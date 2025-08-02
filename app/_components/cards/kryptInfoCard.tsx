// _components/cards/kryptInfoCard.tsx
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Crown, Eye, Lock, Unlock } from "lucide-react";

export default function KryptInfoCard({
  type,
  updatedAt,
  hasAccess,
  isDekrypted,
  draft,
  isOwner,
  id,
  tags = [],
}: {
  type: string;
  updatedAt: string;
  hasAccess?: boolean;
  isDekrypted?: boolean;
  draft?: boolean;
  isOwner?: boolean;
  id: string;
  tags?: { username: string; id: string; profileImage: string }[];
}) {
  const router = useRouter();

  return (
    <div className="p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl mb-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-white bg-slate-700/60 px-3 py-1 rounded-full border border-slate-600 uppercase tracking-wider">
            {type}
          </span>
          {draft && (
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/50">
              Draft
            </span>
          )}
          {isOwner && (
            <div className="flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/50 rounded-full px-3 py-1.5">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <Crown size={12} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                Owner
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-slate-400">
          Last updated: {new Date(updatedAt).toLocaleDateString()}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Link
              href={`/dashboard/profile/${tag.id}`}
              key={tag.id}
              className="group flex items-center bg-slate-700/40 rounded-full px-3 py-1.5 transition-all hover:bg-slate-600"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-slate-500">
                <Image
                  src={tag.profileImage || "/placeholder-avatar.png"}
                  alt={tag.username}
                  width={20}
                  height={20}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-xs text-slate-300 group-hover:text-white">
                {tag.username}
              </span>
            </Link>
          ))}
          {tags.length > 3 && (
            <div className="text-xs text-slate-400 flex items-center">
              +{tags.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Button states */}
      {!hasAccess && (
        <div className="bg-slate-700/60 p-4 rounded-xl text-center my-6 border border-slate-600 shadow-inner">
          <p className="text-slate-300 mb-3 text-sm">
            You need to unlock this krypt to view its content.
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/answer`)}
            className="group relative overflow-hidden px-6 py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 mx-auto"
          >
            <Lock size={18} />
            Unlock this krypt
          </button>
        </div>
      )}

      {isDekrypted && (
        <div className="bg-emerald-500/20 p-4 rounded-xl text-center my-6 border border-emerald-400/50 shadow-inner">
          <p className="text-emerald-400 mb-3 text-sm">
            You have successfully unlocked this krypt!
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/unlock`)}
            className="group relative overflow-hidden px-6 py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 mx-auto"
          >
            <Unlock size={18} />
            View Krypt
          </button>
        </div>
      )}

      {hasAccess && !isDekrypted && (
        <div className="bg-slate-700/60 p-4 rounded-xl text-center my-6 border border-slate-600 shadow-inner">
          <p className="text-slate-300 mb-3 text-sm">
            You have access to view this krypt&apos;s content.
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/unlock`)}
            className="group relative overflow-hidden px-6 py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 mx-auto"
          >
            <Eye size={18} />
            View Krypt
          </button>
        </div>
      )}
    </div>
  );
}

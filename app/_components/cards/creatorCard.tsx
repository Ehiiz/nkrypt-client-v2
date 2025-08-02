// _components/cards/creatorCard.tsx
import Image from "next/image";
import { Clock, User } from "lucide-react"; // Using Lucide icon for consistency
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function CreatorCard({
  creatorImage,
  creatorName,
  createdAt,
  creatorId,
}: {
  creatorImage: string;
  creatorName: string;
  createdAt: string;
  creatorId: string;
}) {
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-center gap-4 mb-6 p-4 sm:p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
      <Link
        href={`/dashboard/profile/${creatorId}`}
        className="relative flex-shrink-0"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500 shadow-md">
          {creatorImage ? (
            <Image
              src={creatorImage}
              alt={creatorName || "Creator"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <User size={24} className="text-slate-400" />
            </div>
          )}
        </div>
      </Link>
      <div>
        <Link
          href={`/dashboard/profile/${creatorId}`}
          className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:opacity-80 transition-opacity"
        >
          {creatorName}
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
          <Clock size={16} className="text-slate-500" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

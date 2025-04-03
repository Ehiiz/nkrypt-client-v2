import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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
    <div className="bg-[#222227] rounded-lg p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 bg-[#2A2A30] px-3 py-1 rounded-full">
            {type}
          </span>
          {draft && (
            <span className="text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full text-xs">
              Draft
            </span>
          )}
          {isOwner && (
            <span className="text-[#B2F17E] bg-[#B2F17E]/20 px-3 py-1 rounded-full text-xs">
              Owner
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">
          Last updated: {new Date(updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Tags section - show first 3 tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Link
              href={`/dashboard/profile/${tag.id}`}
              key={tag.id}
              className="flex items-center bg-[#2A2A30] rounded-full px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                // Optional navigation to tag profile
              }}
            >
              <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                <Image
                  src={tag.profileImage || "/placeholder-avatar.png"}
                  alt={tag.username}
                  width={16}
                  height={16}
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-300">{tag.username}</span>
            </Link>
          ))}
          {tags.length > 3 && (
            <div className="text-xs text-gray-400 flex items-center">
              +{tags.length - 3} more
            </div>
          )}
        </div>
      )}

      {!hasAccess && (
        <div className="bg-[#333339] p-4 rounded-md text-center my-6">
          <p className="text-gray-300 mb-3">
            You need to unlock this krypt to view its content
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/answer`)}
            className="bg-[#6558C8] hover:bg-[#5649B9] transition-colors text-white px-6 py-2 rounded-md"
          >
            Unlock this krypt
          </button>
        </div>
      )}

      {isDekrypted && (
        <div className="bg-[#B2F17E]/20 p-4 rounded-md text-center my-6">
          <p className="text-[#B2F17E] mb-3">
            You have successfully unlocked this krypt!
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/unlock`)}
            className="bg-[#6558C8] hover:bg-[#5649B9] transition-colors text-white px-6 py-2 rounded-md"
          >
            View Krypt
          </button>
        </div>
      )}

      {/* Show View Krypt button when hasAccess is true but not isDekrypted */}
      {hasAccess && !isDekrypted && (
        <div className="bg-[#333339] p-4 rounded-md text-center my-6">
          <p className="text-gray-300 mb-3">
            You have access to view this krypt&apos;s content
          </p>
          <button
            onClick={() => router.push(`/dashboard/krypt/${id}/unlock`)}
            className="bg-[#6558C8] hover:bg-[#5649B9] transition-colors text-white px-6 py-2 rounded-md"
          >
            View Krypt
          </button>
        </div>
      )}
    </div>
  );
}

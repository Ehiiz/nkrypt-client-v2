/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { IReponseFormattedKrypt } from "@/app/_hooks/user/krypt/krypt.interface";

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
}: IReponseFormattedKrypt) {
  // Format the date to show relative time
  const formattedDate = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
  });

  // Get status text and color
  const getStatusInfo = () => {
    if (isDekrypted) return { color: "#B2F17E", text: "Dekrypted" };
    if (hasAccess) return { color: "#FFC600", text: "Access Granted" };
    return { color: "#C4C4C4", text: "Locked" };
  };

  const statusInfo = getStatusInfo();

  return (
    <Link href={`/dashboard/krypt/${id}`}>
      <div className="m-3 cursor-pointer group transform transition-all duration-300 hover:-translate-y-1 font-aeonik">
        <div className="bg-[#222227] rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
          {/* Status Bar */}
          <div
            className="h-1 w-full transition-all duration-300"
            style={{ backgroundColor: statusInfo.color }}
          />

          {/* Card Header with Type and Status */}
          <div className="p-5 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${statusInfo.color}20`,
                  color: statusInfo.color,
                }}
              >
                {statusInfo.text}
              </span>
              {isOwner && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#FFC600]20 text-[#FFC600]">
                  Owner
                </span>
              )}
            </div>
            <span className="text-xs uppercase tracking-wider text-[#C4C4C4]">
              {type}
            </span>
          </div>

          {/* Card Content */}
          <div className="px-5 pb-4 flex-grow">
            <h3 className="text-xl font-bold mb-3 text-[#FFC600] truncate group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                {description}
              </p>
            )}

            {/* Tags Section - First 3 tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.slice(0, 3).map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center bg-[#2A2A30] rounded-full px-2 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Optional: Add navigation to tag profile
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
                    <span className="text-xs text-gray-300">
                      {tag.username}
                    </span>
                  </div>
                ))}
                {tags.length > 3 && (
                  <div className="text-xs text-gray-400 flex items-center">
                    +{tags.length - 3} more
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="flex items-center space-x-4">
              {/* Success Icon */}
              <div className="flex items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#B2F17E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12L11 15L16 10"
                    stroke="#B2F17E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-1 text-xs text-[#C4C4C4]">
                  {successCount}
                </span>
              </div>

              {/* Failure Icon */}
              <div className="flex items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#FF6B6B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9L9 15"
                    stroke="#FF6B6B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 9L15 15"
                    stroke="#FF6B6B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-1 text-xs text-[#C4C4C4]">
                  {failureCount}
                </span>
              </div>

              {/* Comment Icon */}
              <div className="flex items-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                    stroke="#FFC600"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-1 text-xs text-[#C4C4C4]">
                  {commentCount}
                </span>
              </div>
            </div>

            {/* Time Badge */}
            <span className="text-xs text-[#C4C4C4]">{formattedDate}</span>
          </div>

          {/* Creator Info */}
          <div className="px-5 py-4 border-t border-gray-800 flex items-center">
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden border-2"
              style={{ borderColor: statusInfo.color }}
            >
              {creatorImage ? (
                <Image
                  src={creatorImage}
                  alt={creatorName || "Creator"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {creatorName?.charAt(0).toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {creatorName || "Anonymous"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

import Image from "next/image";
import CalendarIcon from "../custom/svgs/clock";
import Link from "next/link";
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
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link
        href={`/dashboard/profile/${creatorId}`}
        className="w-12 h-12 rounded-full overflow-hidden"
      >
        <Image
          src={creatorImage || "/placeholder-avatar.png"}
          alt={creatorName || "alt image"}
          width={48}
          height={48}
          className="object-cover"
        />
      </Link>
      <div>
        <Link
          href={`/dashboard/profile/${creatorId}`}
          className="text-[#B2F17E] font-semibold"
        >
          {creatorName}
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarIcon />
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

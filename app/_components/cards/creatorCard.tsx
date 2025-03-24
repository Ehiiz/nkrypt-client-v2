import Image from "next/image";
import CalendarIcon from "../custom/svgs/clock";
export default function CreatorCard({
  creatorImage,
  creatorName,
  createdAt,
}: {
  creatorImage: string;
  creatorName: string;
  createdAt: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={creatorImage || "/placeholder-avatar.png"}
          alt={creatorName || "alt image"}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div>
        <p className="text-[#B2F17E] font-semibold">{creatorName}</p>
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

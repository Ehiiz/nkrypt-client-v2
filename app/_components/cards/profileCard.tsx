import Image from "next/image";
import Link from "next/link";
export default function ProfileCard({
  profileImage,
  username,
  bio,
  followersCount,
  followingCount,
  kryptCount,
  profileId,
}: {
  profileImage?: string;
  username?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  kryptCount: number;
  profileId: string;
}) {
  return (
    <div className="relative">
      {/* Cover image */}
      <div className="h-32 bg-gradient-to-r from-[#6558C8] to-[#F0A4FF]"></div>

      <div className="flex flex-col items-center -mt-16 px-4">
        <div className="relative mb-3">
          <div className="rounded-full overflow-hidden border-4 border-[#F0A4FF] h-28 w-28 bg-[#222227]">
            <Image
              src={profileImage || "/placeholder-avatar.png"}
              alt="Profile"
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="text-center mb-3">
          <p className="text-[#B2F17E] font-semibold text-xl">
            @{username || "username"}
          </p>
          <p className="text-sm text-gray-300 mt-2 max-w-md">
            {bio || "No bio available"}
          </p>
        </div>

        {/* Stats */}
        <div className="flex w-full justify-center gap-12 mb-4">
          <Link
            href={`/dashboard/profile/${profileId}/followers`}
            className="text-center"
          >
            <p className="text-[#B2F17E] font-bold text-lg">
              {followersCount || 0}
            </p>
            <p className="text-sm text-gray-300">Followers</p>
          </Link>
          <Link
            href={`/dashboard/profile/${profileId}/following`}
            className="text-center"
          >
            <p className="text-[#B2F17E] font-bold text-lg">
              {followingCount || 0}
            </p>
            <p className="text-sm text-gray-300">Following</p>
          </Link>
          <div className="text-center">
            <p className="text-[#B2F17E] font-bold text-lg">
              {kryptCount || 0}
            </p>
            <p className="text-sm text-gray-300">Krypts</p>
          </div>
        </div>

        {/* Settings Button */}
        {/* <button className="flex items-center gap-2 bg-[#6558C8] hover:bg-[#5649B9] transition-colors text-white px-5 py-2 rounded-full mb-6">
        <Settings size={16} />
        <span>Settings</span>
      </button> */}
      </div>
    </div>
  );
}

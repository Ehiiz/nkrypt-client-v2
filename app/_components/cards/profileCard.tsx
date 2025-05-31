"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

export default function ProfileCard({
  profileImage,
  username,
  bio,
  followersCount,
  followingCount,
  kryptCount,
  profileId,
  walletAddress,
}: {
  profileImage?: string;
  username?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  kryptCount: number;
  profileId: string;
  walletAddress: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const trimAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

        <div
          className="text-center flex items-center gap-2 mb-3 bg-gray-800 hover:bg-gray-700 p-2 rounded-lg cursor-pointer transition-colors group"
          onClick={handleCopyAddress}
          title="Click to copy wallet address"
        >
          {/* Cardano-inspired coin icon */}
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 border border-white rounded-full opacity-80"></div>
          </div>

          <p className="text-gray-300 font-mono text-sm">
            {trimAddress(walletAddress)}
          </p>

          <div className="ml-1">
            {isCopied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy
                size={14}
                className="text-gray-400 group-hover:text-gray-300 transition-colors"
              />
            )}
          </div>
        </div>

        {/* Copy feedback */}
        {isCopied && (
          <div className="text-xs text-green-400 mb-2 animate-fade-in">
            Address copied to clipboard!
          </div>
        )}

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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

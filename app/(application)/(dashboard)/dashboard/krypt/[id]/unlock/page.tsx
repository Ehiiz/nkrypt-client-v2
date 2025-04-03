/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { useUnlockedKrypts } from "@/app/_hooks/user/krypt/useUnlockedKrypt";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { useCommentsForKrypts } from "@/app/_hooks/user/krypt/useCommentsForKrypts";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import YouTubePlayer from "@/app/_components/players/youtubeMusicPlayer";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import Link from "next/link";
import CreatorCard from "@/app/_components/cards/creatorCard";
import StatsAndActionCard from "@/app/_components/cards/statsAndActionCard";
import CommentAndShareTab from "@/app/_components/tabs/commentAndShareTab";
import CommentsList from "@/app/_components/lists/commentsList";
import ShareCard from "@/app/_components/cards/shareCard";
import SubHeader from "@/app/_components/headers/subHeader";
// Adjust the import path as needed

function KryptUnlockPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"comments" | "share">("comments");
  const { krypt, allowed, kryptLoading, error } = useUnlockedKrypts({ id });

  // Fix: Use useEffect for navigation to avoid render issues
  useEffect(() => {
    // Only redirect if data is loaded and user is allowed to access
    if (!kryptLoading && allowed === false) {
      router.push(`/dashboard/krypt/${id}/answer`);
    }
  }, [kryptLoading, allowed, id, router]);

  // Function to check if a string is a YouTube URL
  const isYouTubeUrl = (str: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(str);
  };

  if (kryptLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1A1F] text-gray-400">
        Loading...
      </div>
    );
  }

  if (error || !krypt) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1A1F] text-gray-400">
        <p>Error loading krypt or krypt not found</p>
        <button
          onClick={() => router.replace(`/dashboard/krypt/${id}`)}
          className="text-[#B2F17E] hover:text-[#87F28A]"
        ></button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1F] text-white">
      {/* Header */}

      <SubHeader />
      {/* Krypt Content */}
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {/* Creator Info */}

        <CreatorCard
          createdAt={krypt.createdAt!}
          creatorImage={krypt.creatorImage}
          creatorName={krypt.creatorName}
          creatorId={krypt.creatorId}
        />

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{krypt.title}</h1>
          <p style={{ whiteSpace: "pre-wrap" }} className="text-gray-300">
            {krypt.description}
          </p>
          {krypt.tags && krypt.tags.length > 0 && (
            <div className="flex flex-wrap mt-2 gap-2 mb-3">
              {krypt.tags.slice(0, 3).map((tag) => (
                <Link
                  href={`/dashboard/profile/${tag.id}`}
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
                  <span className="text-xs text-gray-300">{tag.username}</span>
                </Link>
              ))}
              {krypt.tags.length > 3 && (
                <div className="text-xs text-gray-400 flex items-center">
                  +{krypt.tags.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-[#222227] rounded-lg p-5 mb-6">
          {krypt.content.map((item, index) => (
            <div key={index} className="mb-4">
              {item.type === "text" && (
                <p
                  style={{ whiteSpace: "pre-wrap" }}
                  className="text-gray-200 whitespace-pre-wrap"
                >
                  {item.content}
                </p>
              )}
              {item.type === "image" && (
                <div className="my-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.content}
                    alt="Krypt content"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              )}
              {item.type === "sound" && (
                // Render YouTube Player for YouTube links
                <YouTubePlayer url={item.content} title="YouTube Music" />
              )}
              {/* Add support for directly added YouTube links */}
            </div>
          ))}
        </div>

        {/* Stats and Actions */}
        <StatsAndActionCard
          commentCount={krypt.commentCount}
          successCount={krypt.successCount}
          failureCount={krypt.failureCount}
          buttonAction={() => setActiveTab("share")}
        />

        {/* Tabs for Comments and Share */}

        <CommentAndShareTab
          tab={activeTab}
          tabAction={(newTab) => setActiveTab(newTab)}
        />

        {/* Comments or Share Content */}
        <div className="bg-[#222227] rounded-b-lg p-4">
          {activeTab === "comments" ? (
            <CommentsList id={id} />
          ) : (
            <ShareCard id={id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default authUserWrapper(KryptUnlockPage);

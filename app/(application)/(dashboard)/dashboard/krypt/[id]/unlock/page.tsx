// krypt/[id]/unlock/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useUnlockedKrypts } from "@/app/_hooks/user/krypt/useUnlockedKrypt";
import YouTubePlayer from "@/app/_components/players/youtubeMusicPlayer";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import Link from "next/link";
import CreatorCard from "@/app/_components/cards/creatorCard";
import StatsAndActionCard from "@/app/_components/cards/statsAndActionCard";
import CommentAndShareTab from "@/app/_components/tabs/commentAndShareTab";
import CommentsList from "@/app/_components/lists/commentsList";
import ShareCard from "@/app/_components/cards/shareCard";
import SubHeader from "@/app/_components/headers/subHeader";
import { Loader2 } from "lucide-react";

function KryptUnlockPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"comments" | "share">("comments");
  const { krypt, allowed, kryptLoading, error } = useUnlockedKrypts({ id });

  useEffect(() => {
    if (!kryptLoading && allowed === false) {
      router.push(`/dashboard/krypt/${id}/answer`);
    }
  }, [kryptLoading, allowed, id, router]);

  if (kryptLoading) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error || !krypt) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full">
          <p className="text-xl font-semibold text-red-500 mb-4">Error</p>
          <p className="text-slate-400">
            Error loading krypt or krypt not found.
          </p>
          <button
            onClick={() => router.replace(`/dashboard/krypt/${id}`)}
            className="mt-4 text-purple-400 hover:underline"
          >
            Go back to details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <SubHeader />
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full relative z-10">
        {/* Creator Info */}
        <CreatorCard
          createdAt={krypt.createdAt!}
          creatorImage={krypt.creatorImage}
          creatorName={krypt.creatorName}
          creatorId={krypt.creatorId}
        />

        {/* Title and Description */}
        <div className="mb-6 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            {krypt.title}
          </h1>
          <p style={{ whiteSpace: "pre-wrap" }} className="text-slate-300">
            {krypt.description}
          </p>
          {krypt.tags && krypt.tags.length > 0 && (
            <div className="flex flex-wrap mt-4 gap-2 mb-3">
              {krypt.tags.slice(0, 3).map((tag) => (
                <Link
                  href={`/dashboard/profile/${tag.id}`}
                  key={tag.id}
                  className="group flex items-center bg-slate-700/40 rounded-full px-3 py-1 transition-all hover:bg-slate-600"
                  onClick={(e) => {
                    e.preventDefault();
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
              {krypt.tags.length > 3 && (
                <div className="text-xs text-slate-400 flex items-center">
                  +{krypt.tags.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-xl">
          {krypt.content.map((item, index) => (
            <div key={index} className="mb-4">
              {item.type === "text" && (
                <p
                  style={{ whiteSpace: "pre-wrap" }}
                  className="text-slate-200 whitespace-pre-wrap leading-relaxed"
                >
                  {item.content}
                </p>
              )}
              {item.type === "image" && (
                <div className="my-4 rounded-lg overflow-hidden border border-slate-600 shadow-md">
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
                <div className="my-4">
                  <YouTubePlayer url={item.content} title="YouTube Music" />
                </div>
              )}
            </div>
          ))}
          {krypt.backgroundMusic && (
            <div className="mt-6">
              <YouTubePlayer
                url={krypt.backgroundMusic!}
                title="YouTube Music"
              />
            </div>
          )}
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
        <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-b-2xl p-4 shadow-xl">
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

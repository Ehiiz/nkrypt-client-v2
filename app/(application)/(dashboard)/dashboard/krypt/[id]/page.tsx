"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useKryptDetials } from "@/app/_hooks/user/krypt/useKryptDetails";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import StatsAndActionCard from "@/app/_components/cards/statsAndActionCard";
import CommentsList from "@/app/_components/lists/commentsList";
import ShareCard from "@/app/_components/cards/shareCard";
import KryptInfoCard from "@/app/_components/cards/kryptInfoCard";
import CommentAndShareTab from "@/app/_components/tabs/commentAndShareTab";
import CreatorCard from "@/app/_components/cards/creatorCard";
import SubHeader from "@/app/_components/headers/subHeader";
import { Loader2 } from "lucide-react";

function KryptDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"comments" | "share">("comments");

  const {
    kryptDetail,
    error: kryptError,
    kryptDetailLoading,
  } = useKryptDetials({ id });

  if (kryptDetailLoading) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }

  if (kryptError || !kryptDetail) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full">
          <p className="text-xl font-semibold text-red-500 mb-4">Error</p>
          <p className="text-slate-400">
            Error loading krypt or krypt not found.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-purple-400 hover:underline"
          >
            Go back
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
          createdAt={kryptDetail.createdAt}
          creatorImage={kryptDetail.creatorImage}
          creatorName={kryptDetail.creatorName}
          creatorId={kryptDetail.creatorId}
        />

        {/* Title and Description */}
        <div className="mb-6 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            {kryptDetail.title}
          </h1>
          <p style={{ whiteSpace: "pre-wrap" }} className="text-slate-300">
            {kryptDetail.description}
          </p>
        </div>

        {/* Krypt Info Card */}
        <KryptInfoCard
          id={id}
          hasAccess={kryptDetail.hasAccess}
          isDekrypted={kryptDetail.isDekrypted}
          draft={kryptDetail.draft}
          updatedAt={kryptDetail.updatedAt}
          isOwner={kryptDetail.isOwner}
          type={kryptDetail.type}
          tags={kryptDetail.tags}
        />

        {/* Stats and Actions */}
        <StatsAndActionCard
          commentCount={kryptDetail.commentCount}
          successCount={kryptDetail.successCount}
          failureCount={kryptDetail.failureCount}
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

export default authUserWrapper(KryptDetailsPage);

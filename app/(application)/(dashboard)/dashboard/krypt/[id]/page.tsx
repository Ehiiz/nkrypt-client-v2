/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  MessageCircle,
  Share2,
  ArrowLeft,
  Copy,
  Check,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { useKryptDetials } from "@/app/_hooks/user/krypt/useKryptDetails";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import StatsAndActionCard from "@/app/_components/cards/statsAndActionCard";
import CommentsList from "@/app/_components/lists/commentsList";
import ShareCard from "@/app/_components/cards/shareCard";
import KryptInfoCard from "@/app/_components/cards/kryptInfoCard";
import CalendarIcon from "@/app/_components/custom/svgs/clock";
import CommentAndShareTab from "@/app/_components/tabs/commentAndShareTab";
import CreatorCard from "@/app/_components/cards/creatorCard";
import SubHeader from "@/app/_components/headers/subHeader";

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
      <div className="flex justify-center items-center min-h-screen bg-[#1A1A1F] text-gray-400">
        Loading...
      </div>
    );
  }

  if (kryptError || !kryptDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1A1F] text-gray-400">
        Error loading krypt or krypt not found
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
          createdAt={kryptDetail.createdAt}
          creatorImage={kryptDetail.creatorImage}
          creatorName={kryptDetail.creatorName}
          creatorId={kryptDetail.creatorId}
        />

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {kryptDetail.title}
          </h1>
          <p style={{ whiteSpace: "pre-wrap" }} className="text-gray-300">
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

export default authUserWrapper(KryptDetailsPage);

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ArrowLeft,
  Copy,
  Check,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import { useUnlockedKrypts } from "@/app/_hooks/user/krypt/useUnlockedKrypt";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { useCommentsForKrypts } from "@/app/_hooks/user/krypt/useCommentsForKrypts";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import YouTubePlayer from "@/app/_components/players/youtubeMusicPlayer";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";
import Link from "next/link";
// Adjust the import path as needed

function KryptUnlockPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<"comments" | "share">("comments");
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { krypt, allowed, kryptLoading, error } = useUnlockedKrypts({ id });

  const {
    comments,
    error: commentsError,
    kryptLoading: commentsLoading,
    mutateComments,
  } = useCommentsForKrypts({ id });

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

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const data = await UserKryptService.commentOnKrypt({
        comment: commentText,
        id: id,
      });

      if (data.success) {
        toastAlert({
          type: ToastType.success,
          message: "Comment submitted successfully!",
        });
        setCommentText("");
        mutateComments();
      } else {
        toastAlert({
          type: ToastType.error,
          message: "Error submitting comment",
        });
      }
    } catch (error) {
      toastAlert({
        type: ToastType.error,
        message: "Error submitting comment",
      });
    }
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
      <header className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#222227]">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-300 hover:text-[#B2F17E]"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
        <div className="text-[#B2F17E] font-bold text-xl">NKRYPT</div>
      </header>

      {/* Krypt Content */}
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={krypt.creatorImage || "/placeholder-avatar.png"}
              alt={krypt.creatorName}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-[#B2F17E] font-semibold">{krypt.creatorName}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 2V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                </svg>
                {krypt.createdAt
                  ? new Date(krypt.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Date unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{krypt.title}</h1>
          <p className="text-gray-300">{krypt.description}</p>
        </div>

        {/* Content */}
        <div className="bg-[#222227] rounded-lg p-5 mb-6">
          {krypt.content.map((item, index) => (
            <div key={index} className="mb-4">
              {item.type === "text" && (
                <p className="text-gray-200 whitespace-pre-wrap">
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
        <div className="bg-[#222227] rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <ThumbsUp size={18} className="text-[#B2F17E]" />
                <span className="text-[#B2F17E] font-medium">
                  {krypt.successCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown size={18} className="text-gray-400" />
                <span className="text-gray-400 font-medium">
                  {krypt.failureCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-gray-400" />
                <span className="text-gray-400 font-medium">
                  {krypt.commentCount}
                </span>
              </div>
            </div>
            <button
              className="text-[#B2F17E]"
              onClick={() => setActiveTab("share")}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Tabs for Comments and Share */}
        <div className="flex mt-6 rounded-t-lg overflow-hidden bg-[#222227]">
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 font-medium ${
              activeTab === "comments"
                ? "bg-[#6558C8] text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("comments")}
          >
            <MessageCircle size={18} />
            Comments
          </button>
          <button
            className={`flex-1 py-3 flex justify-center items-center gap-2 font-medium ${
              activeTab === "share"
                ? "bg-[#6558C8] text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("share")}
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Comments or Share Content */}
        <div className="bg-[#222227] rounded-b-lg p-4">
          {activeTab === "comments" ? (
            <>
              {/* Comment Input */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-[#6558C8]"></div>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    className="w-full bg-[#2A2A30] rounded-md p-3 text-gray-200 outline-none focus:ring-1 focus:ring-[#B2F17E] resize-none"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      className="bg-[#6558C8] hover:bg-[#5649B9] transition-colors text-white px-4 py-2 rounded-md"
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {commentsError ? (
                <div className="text-center py-4 text-gray-400">
                  Error loading comments
                </div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            comment.commenterImage || "/placeholder-avatar.png"
                          }
                          alt={comment.commenterName}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 bg-[#2A2A30] p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[#B2F17E] text-sm font-medium">
                            {comment.commenterName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-200 text-sm">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </>
          ) : (
            <div className="p-2">
              <h3 className="text-lg text-white mb-4">Share this krypt</h3>

              <div className="flex justify-center gap-6 mb-6">
                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-[#B2F17E]">
                  <div className="w-12 h-12 rounded-full bg-[#2A2A30] flex items-center justify-center">
                    <Twitter size={20} />
                  </div>
                  <span className="text-xs">Twitter</span>
                </button>

                <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-[#B2F17E]">
                  <div className="w-12 h-12 rounded-full bg-[#2A2A30] flex items-center justify-center">
                    <Facebook size={20} />
                  </div>
                  <span className="text-xs">Facebook</span>
                </button>

                <button
                  className="flex flex-col items-center gap-2 text-gray-300 hover:text-[#B2F17E]"
                  onClick={handleCopyLink}
                >
                  <div className="w-12 h-12 rounded-full bg-[#2A2A30] flex items-center justify-center">
                    {copied ? (
                      <Check size={20} className="text-[#B2F17E]" />
                    ) : (
                      <LinkIcon size={20} />
                    )}
                  </div>
                  <span className="text-xs">
                    {copied ? "Copied!" : "Copy Link"}
                  </span>
                </button>
              </div>

              <div className="bg-[#2A2A30] p-3 rounded-md flex items-center">
                <input
                  type="text"
                  value={
                    typeof window !== "undefined"
                      ? window.location.href
                      : `https://nkrypt.app/krypt/${id}`
                  }
                  readOnly
                  className="bg-transparent flex-1 text-gray-300 outline-none overflow-hidden text-ellipsis"
                />
                <button
                  onClick={handleCopyLink}
                  className="ml-2 text-gray-400 hover:text-[#B2F17E]"
                >
                  {copied ? (
                    <Check size={18} className="text-[#B2F17E]" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default authUserWrapper(KryptUnlockPage);

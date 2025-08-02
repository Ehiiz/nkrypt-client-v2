/* eslint-disable @typescript-eslint/no-unused-vars */
// app/_components/cards/profileCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  Wallet,
  Users,
  UserPlus,
  Hash,
  Loader2,
} from "lucide-react";
import { UserAuthHook } from "@/app/_hooks/user/auth/auth.hook";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import Modal from "@/app/_components/mainModal";
import SeedPhraseModal from "../auth/seedPhraseModal";
import { useUserProfile } from "@/app/_hooks/user/profile/useUserProfile";

export default function ProfileCard({
  profileImage,
  username,
  bio,
  followersCount,
  followingCount,
  kryptCount,
  profileId,
  walletAddress,
  balance,
  isCurrentUser,
  id,
}: {
  profileImage?: string;
  username?: string;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  kryptCount: number;
  profileId: string;
  walletAddress: string;
  balance?: string;
  isCurrentUser: boolean;
  id?: string;
}) {
  const { mutateUserProfile } = useUserProfile({
    id: id!,
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const handleGenerateWallet = async () => {
    setIsGenerating(true);
    try {
      const response = await UserAuthHook.generateWallet();

      if (response.success && response.data?.seedPhrase) {
        setSeedPhrase(response.data.seedPhrase);
        setShowSeedPhraseModal(true);
        toastAlert({
          message: "Wallet generated successfully!",
          type: ToastType.success,
        });
        mutateUserProfile();
      } else {
        toastAlert({
          message: response.message || "Failed to generate wallet.",
          type: ToastType.error,
        });
      }
    } catch (error) {
      toastAlert({
        message: "An unexpected error occurred.",
        type: ToastType.error,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModalClose = () => {
    setShowSeedPhraseModal(false);
    setSeedPhrase("");
    // In a real app, you might want to refresh user data here
    // For now, we'll just close the modal.
  };

  const trimAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900  shadow-2xl border border-purple-500/20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative h-40 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-blue-600/80 backdrop-blur-sm"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full opacity-40"></div>
            <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
            <div className="absolute bottom-12 right-6 w-1 h-1 bg-white rounded-full opacity-30"></div>
            <div className="absolute top-16 left-1/3 w-1 h-1 bg-white rounded-full opacity-40"></div>
            <div className="absolute top-6 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-35"></div>
          </div>
        </div>

        <div className="relative flex flex-col items-center -mt-20 px-6 pb-8">
          {/* Profile image with enhanced styling */}
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="relative rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm h-32 w-32 bg-slate-800/50">
              <Image
                src={profileImage || "/placeholder-avatar.png"}
                alt="Profile"
                width={128}
                height={128}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-slate-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* User info */}
          <div className="text-center mb-6 space-y-3">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-2xl">
              @{username || "username"}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm px-4">
              {bio || "✨ No bio available - mystery user in the crypto verse"}
            </p>
          </div>

          {/* Wallet section */}
          {walletAddress && (
            <div className="mb-6 w-full max-w-sm">
              <div
                className="group relative bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/60 border border-slate-600/50 hover:border-purple-400/50 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                onClick={handleCopyAddress}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <Wallet size={18} className="text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Wallet Address
                      </p>
                      <p className="text-slate-200 font-mono text-sm font-semibold">
                        {trimAddress(walletAddress)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isCopied ? (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Check size={16} />
                        <span className="text-xs font-medium">Copied!</span>
                      </div>
                    ) : (
                      <Copy
                        size={16}
                        className="text-slate-400 group-hover:text-purple-400 transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {isCurrentUser && !walletAddress && (
            <button
              onClick={handleGenerateWallet}
              disabled={isGenerating}
              className="mb-6 group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:bg-slate-700/60 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center space-x-2">
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Wallet size={18} />
                )}
                <span>
                  {isGenerating ? "Generating..." : "Generate Wallet"}
                </span>
              </div>
            </button>
          )}

          {/* Balance section */}
          {balance && isCurrentUser && (
            <div className="mb-6 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl p-4 w-full max-w-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 border-2 border-white rounded-full opacity-90"></div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                      Total Balance
                    </p>
                    <p className="text-emerald-400 font-bold text-lg">
                      {balance}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          {/* Stats with enhanced design */}
          <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
            <Link
              href={`/dashboard/profile/${profileId}/followers`}
              className="group text-center p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 hover:border-purple-400/50 hover:bg-slate-700/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-blue-400 font-bold text-xl group-hover:text-blue-300 transition-colors">
                    {followersCount || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Followers
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={`/dashboard/profile/${profileId}/following`}
              className="group text-center p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 hover:border-pink-400/50 hover:bg-slate-700/40 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserPlus size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-pink-400 font-bold text-xl group-hover:text-pink-300 transition-colors">
                    {followingCount || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Following
                  </p>
                </div>
              </div>
            </Link>

            <div className="group text-center p-4 rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 hover:border-emerald-400/50 hover:bg-slate-700/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <Hash size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-xl group-hover:text-emerald-300 transition-colors">
                    {kryptCount || 0}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">Krypts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSeedPhraseModal && (
        <Modal>
          <SeedPhraseModal seedPhrase={seedPhrase} onClose={handleModalClose} />
        </Modal>
      )}
    </>
  );
}

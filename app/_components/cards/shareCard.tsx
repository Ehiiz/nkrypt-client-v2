"use client";
import { Check, Copy, Facebook, LinkIcon, Twitter } from "lucide-react";
import { useState } from "react";

export default function ShareCard({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
          <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
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
  );
}

// _components/cards/shareCard.tsx
"use client";
import { Check, Copy, Facebook, Link as LinkIcon, Twitter } from "lucide-react";
import { useState } from "react";

export default function ShareCard({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://nkrypt.app/krypt/${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-lg text-slate-300 mb-6 font-semibold">
        Share this krypt
      </h3>

      <div className="flex justify-center gap-6 mb-6">
        <button className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center transition-all hover:scale-110">
            <Twitter size={20} />
          </div>
          <span className="text-xs">Twitter</span>
        </button>

        <button className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center transition-all hover:scale-110">
            <Facebook size={20} />
          </div>
          <span className="text-xs">Facebook</span>
        </button>

        <button
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors"
          onClick={handleCopyLink}
        >
          <div className="w-14 h-14 rounded-full bg-slate-700/60 border border-slate-600 flex items-center justify-center transition-all hover:scale-110">
            {copied ? (
              <Check size={20} className="text-emerald-400" />
            ) : (
              <LinkIcon size={20} />
            )}
          </div>
          <span className="text-xs">{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>

      <div className="bg-slate-700/60 p-3 rounded-xl flex items-center border border-slate-600 shadow-inner">
        <input
          type="text"
          value={
            typeof window !== "undefined"
              ? window.location.href
              : `https://nkrypt.app/krypt/${id}`
          }
          readOnly
          className="bg-transparent flex-1 text-slate-300 outline-none overflow-hidden text-ellipsis text-sm"
        />
        <button
          onClick={handleCopyLink}
          className="ml-2 text-slate-400 hover:text-white"
        >
          {copied ? (
            <Check size={18} className="text-emerald-400" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

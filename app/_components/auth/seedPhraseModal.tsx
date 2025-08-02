// app/_components/auth/seedPhraseModal.tsx
"use client";
import React, { useState } from "react";
import { Copy, Check, ArrowRight, X } from "lucide-react";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";

interface SeedPhraseModalProps {
  seedPhrase: string;
  onClose: () => void;
}

const SeedPhraseModal: React.FC<SeedPhraseModalProps> = ({
  seedPhrase,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    toastAlert({
      message: "Seed phrase copied!",
      type: ToastType.success,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed font-aeonik inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/80 p-4">
      <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Save Your Seed Phrase
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            This is your recovery phrase. Copy and store it securely. You won’t
            be able to see it again.
          </p>
        </div>
        <div className="bg-slate-700/60 p-4 rounded-xl text-sm font-mono text-slate-200 whitespace-pre-wrap break-words max-h-40 overflow-y-auto border border-slate-600">
          {seedPhrase}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto bg-slate-700 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-600 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeedPhraseModal;

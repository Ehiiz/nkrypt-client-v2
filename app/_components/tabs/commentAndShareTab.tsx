// _components/tabs/commentAndShareTab.tsx
import { MessageCircle, Share2 } from "lucide-react";

export default function CommentAndShareTab({
  tab,
  tabAction,
}: {
  tab: string;
  tabAction: (value: "comments" | "share") => void;
}) {
  return (
    <div className="flex mt-6 rounded-t-2xl overflow-hidden shadow-xl border-t border-x border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
      <button
        className={`flex-1 py-4 flex justify-center items-center gap-2 font-semibold transition-colors duration-200 ${
          tab === "comments"
            ? "bg-purple-600 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-700/60"
        }`}
        onClick={() => tabAction("comments")}
      >
        <MessageCircle size={18} />
        Comments
      </button>
      <button
        className={`flex-1 py-4 flex justify-center items-center gap-2 font-semibold transition-colors duration-200 ${
          tab === "share"
            ? "bg-purple-600 text-white"
            : "text-slate-400 hover:text-white hover:bg-slate-700/60"
        }`}
        onClick={() => tabAction("share")}
      >
        <Share2 size={18} />
        Share
      </button>
    </div>
  );
}

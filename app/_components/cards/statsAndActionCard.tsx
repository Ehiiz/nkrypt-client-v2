// _components/cards/statsAndActionCard.tsx
import { MessageCircle, Share2, ThumbsDown, ThumbsUp } from "lucide-react";

export default function StatsAndActionCard({
  failureCount,
  successCount,
  commentCount,
  buttonAction,
}: {
  successCount: number;
  failureCount: number;
  commentCount: number;
  buttonAction: () => void;
}) {
  return (
    <div className="p-4 sm:p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl mb-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <ThumbsUp size={20} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium">{successCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown size={20} className="text-red-400" />
            <span className="text-red-400 font-medium">{failureCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-slate-400" />
            <span className="text-slate-400 font-medium">{commentCount}</span>
          </div>
        </div>
        <button
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors duration-200"
          onClick={buttonAction}
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}

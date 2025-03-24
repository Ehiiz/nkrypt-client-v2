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
  buttonAction: () => void; // Function to call when the button is clicked.
}) {
  return (
    <div className="bg-[#222227] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} className="text-[#B2F17E]" />
            <span className="text-[#B2F17E] font-medium">{successCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown size={18} className="text-gray-400" />
            <span className="text-gray-400 font-medium">{failureCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={18} className="text-gray-400" />
            <span className="text-gray-400 font-medium">{commentCount}</span>
          </div>
        </div>
        <button className="text-[#B2F17E]" onClick={() => buttonAction()}>
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}

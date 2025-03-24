import { MessageCircle, Share2 } from "lucide-react";

export default function CommentAndShareTab({
  tab,
  tabAction,
}: {
  tab: string;
  tabAction: (value: "comments" | "share") => void;
}) {
  return (
    <div className="flex mt-6 rounded-t-lg overflow-hidden bg-[#222227]">
      <button
        className={`flex-1 py-3 flex justify-center items-center gap-2 font-medium ${
          tab === "comments"
            ? "bg-[#6558C8] text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => tabAction("comments")}
      >
        <MessageCircle size={18} />
        Comments
      </button>
      <button
        className={`flex-1 py-3 flex justify-center items-center gap-2 font-medium ${
          tab === "share"
            ? "bg-[#6558C8] text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => tabAction("share")}
      >
        <Share2 size={18} />
        Share
      </button>
    </div>
  );
}

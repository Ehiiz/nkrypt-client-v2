import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { useCommentsForKrypts } from "@/app/_hooks/user/krypt/useCommentsForKrypts";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useState } from "react";
import CommentCard from "../cards/commentCard";

export default function CommentsList({ id }: { id: string }) {
  const [commentText, setCommentText] = useState("");

  const {
    comments,
    error: commentsError,
    kryptLoading: commentsLoading,
    mutateComments,
  } = useCommentsForKrypts({ id });

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toastAlert({
        type: ToastType.error,
        message: "Error submitting comment",
      });
    }
  };

  if (commentsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1A1A1F] text-gray-400">
        Loading...
      </div>
    );
  }

  return (
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
            <CommentCard key={comment._id} {...comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </>
  );
}

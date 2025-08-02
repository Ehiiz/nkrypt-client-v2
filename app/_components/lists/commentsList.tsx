/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// _components/lists/commentsList.tsx
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { useCommentsForKrypts } from "@/app/_hooks/user/krypt/useCommentsForKrypts";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useState } from "react";
import CommentCard from "../cards/commentCard";
import { Loader2 } from "lucide-react";

export default function CommentsList({ id }: { id: string }) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    comments,
    error: commentsError,
    kryptLoading: commentsLoading,
    mutateComments,
  } = useCommentsForKrypts({ id });

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
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
    } catch (error: any) {
      toastAlert({
        type: ToastType.error,
        message: "Error submitting comment",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (commentsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <>
      {/* Comment Input */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-slate-700/60 border border-slate-600" />
        <div className="flex-1">
          <textarea
            placeholder="Add a comment..."
            className="w-full bg-slate-700/60 rounded-xl p-3 text-slate-200 outline-none focus:ring-1 focus:ring-purple-500 resize-none border border-slate-600 placeholder:text-slate-500"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-2">
            <button
              className={`
                px-6 py-2.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2
                ${
                  !commentText.trim() || isSubmitting
                    ? "bg-slate-700/60 cursor-not-allowed text-slate-400"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25"
                }
                transition-all duration-300
              `}
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Commenting...
                </>
              ) : (
                "Comment"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {commentsError ? (
        <div className="text-center py-4 text-red-400">
          Error loading comments.
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment._id} {...comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </>
  );
}

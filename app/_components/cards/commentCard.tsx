import { IComment } from "@/app/_hooks/user/krypt/krypt.interface";
import Image from "next/image";
import Link from "next/link";
export default function CommentCard(comment: IComment) {
  return (
    <div key={comment._id} className="flex gap-3">
      <Link
        href={`/dashboard/profile/${comment.commenterId}`}
        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-600" // Added border
      >
        <Image
          src={comment.commenterImage || "/placeholder-avatar.png"}
          alt={comment.commenterName}
          width={32}
          height={32}
          className="object-cover"
        />
      </Link>
      <div className="flex-1 bg-slate-700/60 p-3 rounded-lg shadow-md border border-slate-600">
        {" "}
        {/* Updated background, added shadow and border */}
        <div className="flex justify-between items-center mb-1">
          <Link
            href={`/dashboard/profile/${comment.commenterId}`}
            className="text-purple-400 text-sm font-medium hover:underline" // Changed color to purple-400 and added hover
          >
            {comment.commenterName}
          </Link>
          <span className="text-xs text-slate-400">
            {" "}
            {/* Updated text color */}
            {new Date(comment.createdAt).toLocaleTimeString()}{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-slate-200 text-sm">{comment?.comment}</p>{" "}
        {/* Updated text color */}
      </div>
    </div>
  );
}

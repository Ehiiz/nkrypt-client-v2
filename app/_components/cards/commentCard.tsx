import { IComment } from "@/app/_hooks/user/krypt/krypt.interface";
import Image from "next/image";
export default function CommentCard(comment: IComment) {
  return (
    <div key={comment._id} className="flex gap-3">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={comment.commenterImage || "/placeholder-avatar.png"}
          alt={comment.commenterName}
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <div className="flex-1 bg-[#2A2A30] p-3 rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[#B2F17E] text-sm font-medium">
            {comment.commenterName}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleTimeString()}{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-200 text-sm">{comment?.comment}</p>
      </div>
    </div>
  );
}

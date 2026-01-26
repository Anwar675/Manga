import { timeAgo } from "@/lib/formatime";
import { Comment } from "@/payload-types";
import { Flame } from "lucide-react";
import Image from "next/image";

interface ChatMessageItemProps {
  comment: Comment;
}

export const ChatMessageItem = ({ comment }: ChatMessageItemProps) => {
  return (
    <div className="m-4 bg-[#FAE1C2] text-left overflow-hidden rounded-sm w-auto">
      <div
        className="bg-[linear-gradient(135deg,#991b1b,#dc2626,#ef4444)]
 flex font-bold  px-4 py-1 items-center bg-size-[1200%_1200%] gap-4 animate-hot"
      >
        <Flame className="fill-amber-600 text-amber-600" />
        <p className="text-[#FAE1C2] text-[18px]">Thông báo quan trọng </p>
      </div>
      <div className="px-4 py-2 flex">
        <div className="w-12 h-12 relative  ">
          <Image
            src="/img/backgorun.jpg"
            alt="avata"
            className="rounded-full"
            fill
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex justify-between md:px-4 px-2 w-full">
            <p className="text-[18px] font-medium">
              {typeof comment.user === "string"
                ? comment.user
                : comment.user.username}
            </p>
            <p>{timeAgo(comment.createdAt)}</p>
          </div>
          <p className="md:px-4 px-2  whitespace-pre-wrap">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

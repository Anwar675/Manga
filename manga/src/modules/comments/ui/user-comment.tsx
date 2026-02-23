import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ReplyList } from "./reply";
import { timeAgo } from "@/lib/formatime";
import { TargetType } from "@/lib/types";

interface CommentsUserProps {
  targetId: string;
  targetType: TargetType;
}

export const CommentsUser = ({ targetId, targetType }: CommentsUserProps) => {
  const [page, setPage] = useState(1);
   const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null);
  const [replyListOpen, setReplyListOpen] = useState<string | null>(null);

  const [mainContent, setMainContent] = useState("");
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const trpc = useTRPC();
  const inputRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setReplyInputOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const queryClient = useQueryClient();
 
  const { data: userComment } = useSuspenseQuery(
    trpc.comments.getUserMessage.queryOptions({
      targetId,
      targetType,
      page,
    }),
  );
  const userCommentGener = useMutation(
    trpc.comments.UserMessage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.comments.getUserMessage.queryFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.comments.getReplies.queryFilter(),
        );
      },
    }),
  );
  const handleReply = (parentId: string) => {
    const text = replyContent[parentId];
    if (!text?.trim()) return;

    userCommentGener.mutate({
      targetId,
      targetType,
      content: text,
      effectComment: "glow",
      parentId,
    });

    setReplyContent((prev) => ({
      ...prev,
      [parentId]: "",
    }));
  };

  const handleGenerComment = () => {
    if (!mainContent.trim()) return;
    setMainContent("");
    userCommentGener.mutate({
      targetId,
      targetType,
      content: mainContent,
      effectComment: "glow",
    });
  };

  return (
    <div className=" rounded-xl bg-rank ">
      <div className="flex gap-2 items-center p-4 text-xl bg-kind rounded-t-xl border-b-2 border-b-amber-700 font-bold">
        <h2>Bình luận</h2>
        <p>({userComment?.totalDocs ?? 0})</p>
      </div>
      <div className="relative my-4">
        <div className="w-full  ">
          <Input
            value={mainContent}
            onChange={(e) => setMainContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleGenerComment();
              }
            }}
            placeholder="Nhập tin nhắn ở đây..."
            className="
    px-2 
    resize-none
    overflow-hidden
    
    dark:bg-[#4c4c4c]
    text-[16px]
    border border-yellow-700
    min-h-12
    
    py-4
    w-full
  "
          />
        </div>
        <Button
          onClick={handleGenerComment}
          className=" right-0 absolute md:bottom-0 bottom-0 z-50 px-4  md:py-4 py-6"
        >
          Gửi
        </Button>
      </div>
      <div className="flex bg-rank flex-col gap-1">
        {userComment?.docs.length === 0 ? (
          <p className="text-center py-4">Chưa có bình luận nào</p>
        ) : (
          userComment?.docs.map((comment) => {
            const avatarUrl =
              typeof comment.user === "object" &&
              comment.user.avatar != null &&
              typeof comment.user.avatar === "object"
                ? comment.user.avatar.url
                : null;

            return (
              <div key={comment.id}>
                <div className="flex   gap-4 px-4 py-2">
                  <div className="w-12 h-12 relative ">
                    <Image
                      src={avatarUrl ?? "/img/background.png"}
                      fill
                      unoptimized
                      className="rounded-full"
                      alt="User Avatar"
                    />
                  </div>
                  <div className="flex-1">
                    <div className=" relative min-w-0 bg-[#fae1c2] text-[#6d3c27] p-2 rounded-lg flex-col gap-2">
                      <div className="flex border-b-2 border-b-amber-600 pb-2 w-full gap-3 font-medium items-center">
                        <h4>
                          {typeof comment.user === "string"
                            ? "Unknown user"
                            : comment.user.username}
                        </h4>
                        <div className="border-2 px-2  border-green-300 rounded-xl">
                          <p
                            className="
                    
                    border-2 border-transparent
                    text-transparent bg-clip-text
                    bg-[linear-gradient(270deg,#ff4d4d,#ffd93d,#4dff88,#4da6ff)]
                    bg-size-[300%_300%]
                    animate-hot
                    bg-transparent
                "
                          >
                            Chí Tôn
                          </p>
                        </div>
                      </div>
                      <p className="px-2 wrap-break-word py-1">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center ">
                      <button
                        onClick={() =>
                          setReplyInputOpen((prev) =>
                            prev === comment.id ? null : comment.id,
                          )
                        }
                        className="flex items-center gap-1 font-light px-4 py-2 cursor-pointer"
                      >
                        <MessageCircle size={15} />
                        <p>Trả lời</p>
                      </button>

                      {comment.replyCount > 0 && (
                        <button
                          onClick={() =>
                            setReplyListOpen((prev) =>
                              prev === comment.id ? null : comment.id,
                            )
                          }
                          className="flex font-bold items-center gap-1 px-4 py-2 cursor-pointer"
                        >
                          <p>{comment.replyCount}</p>
                          <p>Phản hồi</p>
                        </button>
                      )}
                      <p className="flex-1 text-end">
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
                {replyListOpen === comment.id && (
                  <div className="pl-10">
                    <ReplyList
                      targetId={targetId}
                      targetType={targetType}
                      parentId={comment.id}
                      depth={0}
                    />
                  </div>
                )}
                {replyInputOpen === comment.id && (
                  <div ref={inputRef} className="relative w-full mt-2">
                    <Input
                      value={replyContent[comment.id] || ""}
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleReply(comment.id);
                        }
                      }}
                      className="w-full"
                      placeholder="Viết phản hồi..."
                    />

                    <Button
                      onClick={() => handleReply(comment.id)}
                      className="absolute right-0 bottom-0 px-3 py-2"
                    >
                      Gửi
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {userComment && userComment.totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {Array.from({ length: userComment.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  );
};

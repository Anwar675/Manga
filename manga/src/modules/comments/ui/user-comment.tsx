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
import { useState } from "react";

interface CommentsUserProps {
  mangaId: string;
}

export const CommentsUser = ({ mangaId }: CommentsUserProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [hidden, setHidden] = useState<string | null>(null);
;
  const [content, setContent] = useState("");
  const { data: userComment } = useSuspenseQuery(
    trpc.comments.getUserMessage.queryOptions({
      mangaId: mangaId,
      page: 1,
    }),
  );
  const userCommentGener = useMutation(
    trpc.comments.UserMessage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.comments.getUserMessage.queryFilter(),
        );
      },
    }),
  );

  const handleGenerComment = () => {
    if (!content.trim()) return;
    setContent("");
    userCommentGener.mutate({
      mangaId,
      content,
      effectComment: "glow",
    });
  };

  return (
    <div className="bg-rank rounded-xl">
      <div className="flex gap-2 items-center p-4 text-xl bg-kind rounded-t-xl border-b-2 border-b-amber-700 font-bold">
        <h2>Bình luận</h2>
        <p>({userComment?.docs.length ?? 0})</p>
      </div>
      <div className="flex flex-col gap-1">
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
              <div>
                <div className="flex items-center  gap-4 px-4 py-2">
                  <div className="w-12 h-12 relative ">
                    <Image
                      src={avatarUrl ?? "/img/background.png"}
                      fill
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
                    <button
                      onClick={() => setHidden((prev) => prev === comment.id ? null : comment.id)}
                      className="flex items-center gap-1 font-light px-4 py-2 cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <p>Trả lời</p>
                    </button>
                  </div>
                </div>
                {hidden === comment.id && (
                  <div className="relative">
          <div className="w-[90%] ml-auto ">
            <Input
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGenerComment();
                }
              }}
              placeholder="Nhập tin nhắn ở đây..."
              className="
    resize-none
    overflow-hidden
    bg-[#fdd39e]
    dark:bg-[#4c4c4c]
    text-[16px]
    border border-yellow-700
    min-h-12
    max-h-44
    py-2
    w-full
  "
            />
          </div>
          <Button
            onClick={handleGenerComment}
            className=" right-0 absolute md:bottom-0 -bottom-1 z-50 px-4  md:py-4 py-6"
          >
            Gửi
          </Button>
        </div>
                )}
              </div>
            );
          })
        )}
        <div className="relative">
          <div className="w-full  ">
            <Input
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleGenerComment();
                }
              }}
              placeholder="Nhập tin nhắn ở đây..."
              className="
    resize-none
    overflow-hidden
    bg-[#fdd39e]
    dark:bg-[#4c4c4c]
    text-[16px]
    border border-yellow-700
    min-h-12
    max-h-44
    py-2
    w-full
  "
            />
          </div>
          <Button
            onClick={handleGenerComment}
            className=" right-0 absolute md:bottom-0 -bottom-1 z-50 px-4  md:py-4 py-6"
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { timeAgo } from "@/lib/formatime";
import { TargetType } from "@/lib/types";
import { useTRPC } from "@/trpc/client";
import type { RouterOutputs } from "@/trpc/init";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Reply = RouterOutputs["comments"]["getReplies"]["docs"][number];

export const ReplyList = ({
  parentId,
  targetId,
  targetType,
  depth = 0,
}: {
  parentId: string;
  targetId: string;
  targetType: TargetType;
  depth?: number;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
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
  const [replyInputOpen, setReplyInputOpen] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const { data } = useSuspenseQuery(
    trpc.comments.getReplies.queryOptions({ parentId }),
  );

  const replyMutation = useMutation(
    trpc.comments.UserMessage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.comments.getReplies.queryFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.comments.getUserMessage.queryFilter(),
        );
      },
    }),
  );

  const handleReply = (id: string) => {
    const text = replyContent[id];
    if (!text?.trim()) return;

    replyMutation.mutate({
      targetId,
      targetType,

      content: text,
      effectComment: "glow",
      parentId: id,
    });

    setReplyContent((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="flex flex-col gap-2" style={{ marginLeft: depth * 24 }}>
      {data.docs.map((reply: Reply) => {
        const avatarUrl =
          typeof reply.user === "object" &&
          reply.user.avatar &&
          typeof reply.user.avatar === "object"
            ? reply.user.avatar.url
            : null;

        return (
          <div key={reply.id}>
            {/* Reply bubble */}
            <div className="flex gap-4 px-4 py-2">
              <div className="w-10 h-10 relative">
                <Image
                  src={avatarUrl ?? "/img/background.png"}
                  fill
                  className="rounded-full"
                  alt="User Avatar"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="bg-[#fae1c2] text-[#6d3c27] p-2 rounded-lg">
                  <div className=" relative min-w-0 bg-[#fae1c2] text-[#6d3c27] p-2 rounded-lg flex-col gap-2">
                    <div className="flex border-b-2 border-b-amber-600 pb-2 w-full gap-3 font-medium items-center">
                      <h4>
                        {typeof reply.user === "string"
                          ? "Unknown user"
                          : reply.user.username}
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

                    <p className="wrap-break-word whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setReplyInputOpen((prev) =>
                        prev === reply.id ? null : reply.id,
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 text-sm"
                  >
                    <MessageCircle size={14} />
                    Trả lời
                  </button>
                  <p className="text-end flex-1">{timeAgo(reply.createdAt)}</p>
                </div>

                {replyInputOpen === reply.id && (
                  <div ref={inputRef} className="relative w-full mt-2">
                    <Input
                      value={replyContent[reply.id] || ""}
                      onChange={(e) =>
                        setReplyContent((prev) => ({
                          ...prev,
                          [reply.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleReply(reply.id);
                        }
                      }}
                      className="w-full"
                      placeholder="Viết phản hồi..."
                    />

                    <Button
                      onClick={() => handleReply(reply.id)}
                      className="absolute right-0 bottom-0 px-3 py-2"
                    >
                      Gửi
                    </Button>
                  </div>
                )}

                <ReplyList
                  parentId={reply.id}
                  targetId={targetId}
                  targetType={targetType}
                  depth={depth + 1}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

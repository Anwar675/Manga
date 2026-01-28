"use client";
import Image from "next/image";
import { ChatMessageItem } from "./chat-messgae";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/payload-types";

interface AdminChatProps {
  comments: Comment[]
}



export const AdminChat = ({comments}: AdminChatProps) => {
  const messageRef = useRef<HTMLDivElement>(null)
  const trpc = useTRPC();
  useEffect(() => {
  const el = messageRef.current;
  if (!el) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior: "smooth",
  });
}, [comments?.length]);

  const queryClient = useQueryClient()
  const [more, setMore] = useState(false);
  const [content, setContent] = useState("");
  const commentGener = useMutation(trpc.comments.generMessage.mutationOptions({
    onSuccess: async () => {
       await queryClient.invalidateQueries(
        trpc.comments.getMany.queryFilter()
      );
    }
  }));
  const orderedComments = [...comments].reverse();
  const handle = () => {
    if (!content.trim()) return;
    setContent("")
    commentGener.mutate({
      content,
      effectComment: "glow", 
    });
  };

  return (
    <div
      className={`2xl:mx-16 relative justify-between mx-4 my-0  2xl:py-1 md:mx-12 md:my-6 rounded-md ${more ? "h-100 md:h-152" : "h-75 md:h-110"} text-center   bg-rank`}
    >
      <div className="p-4 items-center justify-center bg-kind gap-4 translate-y-4 flex rounded-md mx-4 font-bold">
        <div className="md:-14 md:h-12 w-8 h-8 relative">
          <Image src="/img/speaker.png" alt="name" fill />
        </div>

        <h1 className="md:text-3xl text-[18px]">THÔNG BÁO TỪ BAN QUẢN TRỊ</h1>
      </div>

      <div
        ref={messageRef} className={`${more ? "h-77 md:h-120" : "h-52 md:h-77"} overflow-auto relative rounded-md mx-4 bg-kind my-6 pb-10 md:my-8  `}
      >
        {orderedComments.map((comment) => (
          <ChatMessageItem key={comment.id} comment={comment}/>
        ))}
        
      </div>
      <div className="w-full absolute md:bottom-0 -bottom-1  z-50 ">
        <Textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handle();
            }
          }}
          placeholder="Nhập tin nhắn ở đây..."
          rows={1}
          className="
    resize-none
    overflow-hidden
    bg-[#fdd39e]
    dark:bg-[#4c4c4c]
    text-[16px]
    min-h-12
    max-h-44
    py-2
    w-full
  "
        />
      </div>
      <Button
        onClick={handle}
        className=" right-0 absolute md:bottom-0 -bottom-1 z-50 px-4  md:py-4 py-6"
      >
        Gửi
      </Button>
      <Button
        variant="friend"
        className=" right-15 md:py-0 p-6 absolute md:bottom-0 -bottom-1  z-50 "
      >
        <ChefHat className="size-6" />
      </Button>

      <Button onClick={() => setMore((pre) => !pre)}>
        {more ? "Rút Gọn" : "Xem Thêm"}
      </Button>
    </div>
  );
};

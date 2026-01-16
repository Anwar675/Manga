"use client";
import Image from "next/image";
import { ChatMessageItem } from "./chat-messgae";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const AdminChat = () => {
  const [more, setMore] = useState(false);
  return (
    <div className={`2xl:mx-16 justify-between mx-4 my-0  2xl:py-8 md:mx-12 md:my-6 rounded-md ${more ? "h-100 md:h-152" : "h-75 md:h-110"} text-center   bg-rank`}>
      <div className="p-4 items-center justify-center bg-kind gap-4 translate-y-4 flex rounded-md mx-4 font-bold">
        <div className="md:-14 md:h-12 w-8 h-8 relative">
          <Image src="/img/speaker.png" alt="name" fill />
        </div>

        <h1 className="md:text-3xl text-[18px]">THÔNG BÁO TỪ BAN QUẢN TRỊ</h1>
      </div>

      <div
        className={`${more ? "h-77 md:h-120" : "h-52 md:h-77"} overflow-auto relative rounded-md mx-4 bg-kind my-6 md:my-8  `}
      >
        <ChatMessageItem />
        <ChatMessageItem />
        <ChatMessageItem />
        <ChatMessageItem />
        <ChatMessageItem />
      </div>
      <Button  onClick={() => setMore((pre) => !pre)}>
        {more ? "Rút Gọn" : "Xem Thêm"}
      </Button>
    </div>
  );
};

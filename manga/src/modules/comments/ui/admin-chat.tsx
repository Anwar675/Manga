"use client";
import Image from "next/image";
import { ChatMessageItem } from "./chat-messgae";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat } from "lucide-react";

export const AdminChat = () => {
  const [more, setMore] = useState(false);
  return (
    <div className={`2xl:mx-16 relative justify-between mx-4 my-0  2xl:py-1 md:mx-12 md:my-6 rounded-md ${more ? "h-100 md:h-152" : "h-75 md:h-110"} text-center   bg-rank`}>
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
       
      </div>
      <div className="w-full absolute md:bottom-0 -bottom-1  z-50 ">
        <Input className="bg-[#fdd39e] py-8 text-[16px] dark:bg-[#4c4c4c] w-full" placeholder="Nhập tin nhắn ở đây..."/>
      </div>
      <Button className=" right-0 absolute md:bottom-0 -bottom-1 z-50 px-4  md:py-4 py-8">
        Gửi 
      </Button>
      <Button variant="friend" className=" right-15 md:py-0 p-8 absolute md:bottom-0 -bottom-1  z-50 ">
        <ChefHat className="size-6" /> 
      </Button>
      
      <Button  onClick={() => setMore((pre) => !pre)}>
        {more ? "Rút Gọn" : "Xem Thêm"}
      </Button>
    </div>
  );
};

import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bug,
  ChevronDown,
  Clock,
  Eye,
  MessageCircleCodeIcon,
} from "lucide-react";
import Image from "next/image";

export const ChapterInfor = () => {
  return (
    <div className="flex mt-8 bg-white py-6 dark:bg-[#242527] rounded-md items-center flex-col ">
      <div className="text-center py-4 flex gap-1 flex-col items-center">
        <h1 className="md:text-2xl text-xl font-medium">
          Na Tra Ma Đồng Náo Hải - Chapter 62
        </h1>
        <div className="flex md:text-[16px] text-sm gap-4">
          <div className="flex  text-sm items-center gap-2">
            <Clock />
            <p>22:30</p>
            <p>04/01/2026</p>
          </div>
          <div className="flex text-sm items-center gap-2">
            <Eye />
            <p>9.6k</p>
          </div>
          <div className="flex text-sm items-center gap-2">
            <MessageCircleCodeIcon />
            <p>9.6k</p>
          </div>
        </div>
        <p className="text-center py-2 mx-12 bg-rank w-full">
          {" "}
          Sử dụng mũi tên trái (←) hoặc phải (→) để chuyển chapter
        </p>
        <Button className="flex mt-4">
          <Bug />
          <p>Báo Lỗi</p>
        </Button>
        <div className="flex gap-4 mt-4 md:mt-8">
          <Button size="lg" variant="chapterActive">
            <ArrowLeft />
            <p>Chap trước</p>
          </Button>
          <Button
            size="lg"
            variant="chapterActive"
            className="bg-amber-500 text-[#6d3c27]"
          >
            <p>Chap sau</p>
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="bg-popular w-full">
        <div className="md:w-250 w-full relative mx-auto ">
          <Image
            src="/img/background.png"
            width={1000}
            height={1200}
            className="w-full h-auto object-contain"
            alt=""
          />
        </div>
       
        
      </div>

      <div className="flex gap-2 items-center mt-4">
        <Button size="lg" variant="chapterActive">
          <ArrowLeft />
          <p>Chap trước</p>
        </Button>
        <div className="relative px-2 py-1 cursor-pointer bg-popular">
            <div className="flex gap-1 md:w-40 w-full justify-between  items-center ">
              <p>Chap 12</p>
              <ChevronDown size={18} />
            </div>
            <div className="absolute flex flex-col gap-2  left-0 bg-popular w-full bottom-8 ">
              <p className="hover:bg-gray-200 px-2">Chap 13</p>
              <p className="hover:bg-gray-200 px-2">Chap 13</p>
              <p className="hover:bg-gray-200 px-2">Chap 13</p>
              <p className="hover:bg-gray-200 px-2">Chap 13</p>
              <p className="hover:bg-gray-200 px-2">Chap 13</p>
              
            </div>
        </div>
        <Button
          size="lg"
          variant="chapterActive"
          className="bg-amber-500 text-[#6d3c27]"
        >
          <p>Chap sau</p>
          <ArrowRight />
        </Button>
      </div>
      
    </div>
  );
};

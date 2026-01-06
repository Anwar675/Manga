import Image from "next/image";
import { CardMangaItems } from "./card-mangaItems";
import { Eye, Heart, MessageCircleIcon, ViewIcon } from "lucide-react";
import { rankcolor } from "@/lib/rankColor";

export const NewUpdate = () => {
  return (
    <div className="bg-popular text-text-popular 2xl:px-16 flex justify-between  w-full px-4 py-6  2xl:py-8 md:px-12 md:py-6">
      <div className="flex-1">
        <div className="flex items-center">
          <h1 className="font-bold pr-7">TRUYỆN MỚI CẬP NHẬP</h1>
          <div className="flex-1 h-px bg-text-popular" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <CardMangaItems />
          <CardMangaItems />
          <CardMangaItems />
          <CardMangaItems />
        </div>
      </div>
      <div className="rounded-md ml-8 w-96 h-100 bg-rank flex flex-col">
  
        <div className="sticky top-0 z-10 bg-rank py-2 rounded-t-2xl font-bold text-center">
          TOP 10 TRUYỆN HOT NHẤT
        </div>
        
        <div className="flex-1 py-4 overflow-auto no-scrollbar flex flex-col gap-3  px-4">
          {[1,2,3,4,5,6,7,8,9,10].map((manga, index) => {
            const rank = index + 1
            const rankColor = rankcolor[rank] ?? 'text-blue-400'
            return (
            <div className="flex items-center gap-4 cursor-pointer ">
              <p className={`text-5xl ${rankColor} p-1 w-12 italic font-bold`}>{rank}</p>
              <Image src="/img/rank.png" alt='rank' width={40} height={40} />
              <div> 
                  <h2 className="text-md font-medium">La tiểu hắc chiến ký 2</h2>
                  <div className="flex items-center gap-2 text-view">

                    <div className="flex text-sm items-center  ">
                        <Eye size={16} className="fill-gray-400"/>
                        <p>12.5k</p>
                    </div>
                    <div className="flex text-sm items-center">
                        <MessageCircleIcon size={16} className="fill-[#9da2a8]"/>
                        <p>12.5k</p>
                    </div>
                    <div className="flex text-sm items-center">
                        <Heart size={16} className="fill-gray-400" />
                        <p>12.5k</p>
                    </div>
                  </div>
              </div>
            </div>
            )
          })}
          
          
          
        </div>
      </div>
    </div>
  );
};

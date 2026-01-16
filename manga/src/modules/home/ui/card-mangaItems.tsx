import { cn } from "@/lib/utils";
import { Bookmark, Clock, Eye, Star } from "lucide-react";
import Image from "next/image";

interface CardMangaItemsProps {
  newCard?: boolean;
}

export const CardMangaItems = ({ newCard }: CardMangaItemsProps) => {
  return (
    <>
      {newCard ? (
        <div className="pb-2 mt-4  rounded-md bg-[#fde9d3] dark:bg-[#242526] shadow-sm  cursor-pointer ">
          <div className="relative h-70 ">
            <Image
              src="/img/card1.jpg"
              alt="card"
              fill
              className="rounded-t-xl"
            />
            <p className="px-2 py-0.5 m-2 rounded-md text-center text-white text-sm font-light absolute  bg-[linear-gradient(149deg,#d9534f,#ff9400,#ffd800,#ffd800,#ff9400,#d9534f)]
                bg-size-[1200%_1200%]
                animate-hot">
              Hot
            </p>
            <p
              className="px-2 py-0.5 m-2 rounded-md text-center bg-[#d9534f] text-white text-sm right-0 font-light absolute"
            >
              18+
            </p>
          </div>
          <p className="truncate font-normal p-2">Natra ma đồng náo hải 2</p>
          <div className="flex px-2 justify-between items-center">
            <div className="flex items-center text-[#7b8084] dark:text-white text-sm">
              <Eye size={20} className="fill-gray-400" />
              <p>12.5k</p>
            </div>
             <div className="flex gap-0.5 items-center text-sm">
              <Clock size={20} />
              <p>2 giờ trước</p>
            </div>
            
          </div>
          <div className="flex px-2 justify-between items-center ">
            <p className="p-1 hover:bg-[#fdd39e] rounded-md">Chap 10</p>
            <div className="flex gap-0.5 items-center text-[#7b8084] dark:text-white text-sm">
              <Bookmark size={20} className="fill-[#7b8084]" />
              <p>6.4k</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4  cursor-pointer ">
          <div className="relative h-55 ">
            <Image
              src="/img/card1.jpg"
              alt="card"
              fill
              className="rounded-t-xl"
            />
          </div>
          <p className="truncate font-normal px-2">Natra ma đồng náo hải 2</p>
          <div className="flex px-2 justify-between items-center">
            <div className="flex gap-0.5 items-center">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  size={12}
                  className={cn(
                    " text-yellow-500",
                    index >= 4 ? "fill-white" : " fill-yellow-500"
                  )}
                />
              ))}
              <p className="text-yellow-600  text-sm">4.5/5</p>
            </div>
            <div className="flex items-center text-sm text-view">
              <Eye size={20} className="fill-gray-400" />
              <p>12.5k</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

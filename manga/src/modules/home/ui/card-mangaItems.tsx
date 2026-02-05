import { formatViews, timeAgo } from "@/lib/formatime";
import { cn } from "@/lib/utils";
import { Mangas } from "@/payload-types";
import { Bookmark, Clock, Eye, Star, StarHalf } from "lucide-react";
import Image from "next/image";

interface CardMangaItemsProps {
  newCard?: boolean;
  manga: Mangas;
}

export const CardMangaItems = ({ newCard, manga }: CardMangaItemsProps) => {
  if (!manga) return null;

  const ratingAvg = manga.rating?.avg ?? 0;
  
  const updateAt = manga?.latestChapter?.updatedAt;
  const coverUrl =
    manga?.cover &&
    typeof manga.cover === "object" &&
    "url" &&
    typeof manga.cover.url === "string"
      ? manga.cover.url
      : "/img/card1.jpg";

  return (
    <>
      {newCard ? (
        <div className="pb-2 mt-4  rounded-md bg-[#fde9d3] dark:bg-[#242526] shadow-sm  cursor-pointer ">
          <div className="relative h-70 ">
            <Image src={coverUrl} alt="card" fill className="rounded-t-xl" />
            <p
              className="px-2 py-0.5 m-2 rounded-md text-center text-white text-sm font-light absolute  bg-[linear-gradient(149deg,#d9534f,#ff9400,#ffd800,#ffd800,#ff9400,#d9534f)]
                bg-size-[1200%_1200%]
                animate-hot"
            >
              Hot
            </p>
            <p className="px-2 py-0.5 m-2 rounded-md text-center bg-[#d9534f] text-white text-sm right-0 font-light absolute">
              18+
            </p>
          </div>
          <p className="truncate font-normal p-2">{manga.title}</p>
          <div className="flex px-2 justify-between items-center">
            <div className="flex items-center text-[#7b8084] dark:text-white text-sm">
              <Eye size={20} className="fill-gray-400" />
              <p>{formatViews(manga.views)}</p>
            </div>
            <div className="flex gap-0.5 items-center text-sm">
              <Clock size={20} />
              <p>{updateAt ? timeAgo(updateAt) : "Chưa cập nhập"}</p>
            </div>
          </div>
          <div className="flex px-2 justify-between items-center ">
            <p className="p-1 hover:bg-[#fdd39e] rounded-md">
              {manga.latestChapter?.number
                ? `Chap ${manga.latestChapter.number}`
                : "Chưa có chap"}
            </p>
            <div className="flex gap-0.5 items-center text-[#7b8084] dark:text-white text-sm">
              <Bookmark size={20} className="fill-[#7b8084]" />
              <p>{manga.followers}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-4  cursor-pointer ">
          <div className="relative h-65 ">
            <Image src={coverUrl} alt="card" fill className="rounded-t-xl" />
          </div>
          <p className="truncate font-normal px-2">{manga.title}</p>
          <div className="flex px-2 justify-between items-center">
            <div className="flex gap-0.5 items-center">
              {[1, 2, 3, 4, 5].map((i) => {
                const full = Math.floor(ratingAvg);
                const hasHalf = ratingAvg % 1 >= 0.5;

                if (i <= full) {
                  return (
                    <Star
                      key={i}
                      size={12}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  );
                }

                if (i === full + 1 && hasHalf) {
                  return (
                    <div key={i} className="relative w-3 h-3">
                      <Star size={12} className="absolute text-yellow-500" />
                      <Star
                        size={12}
                        className="absolute fill-yellow-500 text-yellow-500"
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                      />
                    </div>
                  );
                }

                return <Star key={i} size={12} className="text-yellow-500" />;
              })}

              <p className="text-yellow-600  text-sm">
                {ratingAvg.toFixed(1)}/5
              </p>
            </div>
            <div className="flex items-center text-sm text-view">
              <Eye size={20} className="fill-gray-400" />
              <p>{formatViews(manga.views)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

"use client";
import { useTRPC } from "@/trpc/client";
import { RouterOutputs } from "@/trpc/init";
import { useQuery } from "@tanstack/react-query";
import { Eye, Heart, MessageCircleIcon } from "lucide-react";
import Image from "next/image";

type RankManga = RouterOutputs["magas"]["getRank"][number];

interface RankCardProps {
  rankColor: string;
  rank: number;
  manga: RankManga;
}

export const RankCard = ({ rankColor, rank, manga }: RankCardProps) => {
  const trpc = useTRPC();
  const { data: comments } = useQuery(
    trpc.comments.getUserMessage.queryOptions({
      targetId: manga.id,
      targetType: "mangas",
      page: 1,
    }),
  );
  return (
    <div className="flex items-center gap-4 cursor-pointer ">
      <p className={`text-5xl  ${rankColor} p-1 w-12 italic font-bold`}>
        {rank}
      </p>
      <Image
        src={
          typeof manga.cover === "string"
            ? manga.cover
            : (manga.cover?.url ?? "/images/manga-placeholder.jpg")
        }
        unoptimized
        width={48}
        height={48}
        alt="rank"
        className="w-12 h-12 object-cover"
      />
      <div className="flex-1">
        <h2 className="text-md font-medium text-wrap">{manga.title}</h2>
        <div className="flex items-center gap-2 text-view">
          <div className="flex text-sm items-center  ">
            <Eye size={16} className="fill-gray-400" />
            <p>{manga.views}</p>
          </div>
          <div className="flex text-sm items-center">
            <MessageCircleIcon size={16} className="fill-[#9da2a8]" />
            <p>{comments?.totalDocs}</p>
          </div>
          <div className="flex text-sm items-center">
            <Heart size={16} className="fill-gray-400" />
            <p>{manga.followers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { rankcolor } from "@/lib/rankColor";
import { RankCard } from "@/modules/home/ui/rank-card";
import { Category } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { BookMarked } from "lucide-react";
import Link from "next/link";

interface RankKindProps {
  category: Category[];
}

export const RankKind = ({ category }: RankKindProps) => {
  const trpc = useTRPC();
  const { data: rank } = useQuery(trpc.magas.getRank.queryOptions());

  return (
    <div className="flex flex-col  gap-4">
      <div className="rounded-md ml-0 md:ml-8 md:w-90 w-full h-100 bg-rank flex flex-col">
        <div className="sticky top-0 z-10 bg-rank py-2 rounded-t-2xl font-bold text-center">
          TOP 10 TRUYỆN HOT NHẤT
        </div>

        <div className="flex-1 py-4 overflow-auto no-scrollbar flex flex-col gap-3  px-4">
          {rank?.map((manga, index) => {
            const rank = index + 1;
            const rankColor = rankcolor[rank] ?? "text-blue-400";
            return (
              <Link href={`/manga/${manga.slug}`} key={manga.id}>
                <RankCard
                  key={manga.id}
                  rank={rank}
                  rankColor={rankColor}
                  manga={manga}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="rounded-md ml-0 md:ml-8 md:w-90 w-full h-100 bg-rank flex flex-col">
        <div className="flex justify-between bg-kind rounded-t-md p-4">
          <h1 className="font-bold text-xl">Thể loại</h1>
          <BookMarked />
        </div>
        <div className="relative gap-2 h-78 overflow-auto no-scrollbar  p-4 flex flex-wrap ">
          {category.map((subcategory: Category) => (
            <p
              key={subcategory.id}
              className="px-2 cursor-pointer py-1 rounded-md whitespace-nowrap bg-kind"
            >
              {subcategory.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

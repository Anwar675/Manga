"use client";

import { CardMangaItems } from "@/modules/home/ui/card-mangaItems";
import { RankKind } from "@/modules/manga/ui/rank-kind";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const trpc = useTRPC();
  const { genner } = useParams<{ genner: string }>();
  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions(),
  );
  const { data } = useSuspenseQuery(
    trpc.magas.getGenner.queryOptions({
      slug: genner,
    }),
  );
  console.log(data);

  return (
    <div className="2xl:px-16 md:flex block justify-between bg-popular w-full px-4 py-6  2xl:py-8 md:px-12 md:py-6 ">
      <div className="flex-1">
        <div className="flex items-center gap-2 bg-kind text-xl font-bold px-6 py-4 rounded-xl">
          <h1 >{genner}</h1>
          <p>({data?.length ?? 0})</p>
        </div>

        {data.map((manga) => (
          <div
            key={manga.id}
            className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-4 "
          >
            <Link key={manga.id} href={`/manga/${manga.slug}`}>
              <CardMangaItems newCard manga={manga as Mangas} />
            </Link>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center text-text-popular mt-8">
            Không có truyện nào trong thể loại này.
          </div>
        )}
      </div>

      <RankKind category={category} />
    </div>
  );
};

export default Page;

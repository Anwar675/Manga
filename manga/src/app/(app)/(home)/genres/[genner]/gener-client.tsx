"use client";

import { CardMangaItems } from "@/modules/home/ui/card-mangaItems";
import { RankKind } from "@/modules/manga/ui/rank-kind";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = {
  genner: string;
};

const GennerClient = ({ genner }: Props) => {
  const trpc = useTRPC();

  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions(),
  );

  const { data = [] } = useSuspenseQuery(
    trpc.magas.getGenner.queryOptions({
      slug: genner,
    }),
  );

  return (
    <main className="2xl:px-16 md:flex block justify-between bg-popular w-full px-4 py-6 2xl:py-8 md:px-12 md:py-6">
      <section className="flex-1">
     
        <header className="flex items-center gap-2 bg-kind text-xl font-bold px-6 py-4 rounded-xl">
          <h1>Thể loại: {genner}</h1>
          <p>({data.length})</p>
        </header>

        {/* FIX: grid bọc ngoài map */}
        {data.length > 0 ? (
          <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-4 mt-4">
            {data.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.slug}`}
                prefetch
              >
                <CardMangaItems newCard manga={manga as Mangas} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-text-popular mt-8">
            Không có truyện nào trong thể loại này.
          </div>
        )}
      </section>

      <aside>
        <RankKind category={category} />
      </aside>
    </main>
  );
};

export default GennerClient;

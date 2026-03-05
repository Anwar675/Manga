"use client";

import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();

  const { data: manga, isLoading } = useQuery(
    trpc.magas.getRankMonth.queryOptions({ page: 1 })
  );
  const MonthkIds = manga?.docs?.map((m) => m.id) ?? [];

  const { data: redisViewsMonth } = useQuery(
    trpc.magas.getViewsBatch.queryOptions({
      ids: MonthkIds,
    }),
  );
  const mergedRankMonth =
    manga?.docs?.map((m, i) => ({
      ...m,
      views: (m.views ?? 0) + (redisViewsMonth?.[i] ?? 0),
    })) ?? [];
  const { data: category } = useQuery(
    trpc.category.getSubMany.queryOptions()
  );

  if (isLoading || !manga || !category) {
    return <div>Loading...</div>;
  }

    return (
        <div className="bg-popular">
            <NewUpdate mangas={mergedRankMonth as Mangas[]} category={category} page={manga.page} totalPages={manga.totalPages} />
        </div>
    )
}

export default Page
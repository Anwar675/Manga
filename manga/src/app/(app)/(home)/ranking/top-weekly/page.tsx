"use client";

import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();

  const { data: manga, isLoading } = useQuery(
    trpc.magas.getRankWeek.queryOptions({ page: 1 }),
  );
  const weekIds = manga?.docs?.map((m) => m.id) ?? [];

  const { data: redisViewsWeek } = useQuery(
    trpc.magas.getViewsBatch.queryOptions({
      ids: weekIds,
    }),
  );
  const mergedRankWeek =
    manga?.docs?.map((m, i) => ({
      ...m,
      views: (m.views ?? 0) + (redisViewsWeek?.[i] ?? 0),
    })) ?? [];
  const { data: category } = useQuery(trpc.category.getSubMany.queryOptions());

  if (isLoading || !manga || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-popular">
      <NewUpdate
        mangas={mergedRankWeek as Mangas[]}
        category={category}
        page={manga.page}
        totalPages={manga.totalPages}
      />
    </div>
  );
};

export default Page;

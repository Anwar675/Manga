"use client";

import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();

  const { data: manga, isLoading } = useQuery(
    trpc.magas.getRankDay.queryOptions({ page: 1 }),
  );
  const daykIds = manga?.docs?.map((m) => m.id) ?? [];

  const { data: redisViewsDay } = useQuery(
    trpc.magas.getViewsBatch.queryOptions({
      ids: daykIds,
    }),
  );
  const mergedRankDay =
    manga?.docs?.map((m, i) => ({
      ...m,
      views: (m.views ?? 0) + (redisViewsDay?.[i] ?? 0),
    })) ?? [];
  const { data: category } = useQuery(trpc.category.getSubMany.queryOptions());

  if (isLoading || !manga || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-popular">
      <NewUpdate
        mangas={mergedRankDay as Mangas[]}
        category={category}
        page={manga.page}
        totalPages={manga.totalPages}
      />
    </div>
  );
};

export default Page;

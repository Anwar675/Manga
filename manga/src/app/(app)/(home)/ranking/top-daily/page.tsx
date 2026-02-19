"use client";

import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();

  const { data: manga, isLoading } = useQuery(
    trpc.magas.getRankDay.queryOptions({ page: 1 })
  );

  const { data: category } = useQuery(
    trpc.category.getSubMany.queryOptions()
  );

  if (isLoading || !manga || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-popular">
      <NewUpdate
        mangas={manga.docs as Mangas[]}
        category={category}
        page={manga.page}
        totalPages={manga.totalPages}
      />
    </div>
  );
};

export default Page;

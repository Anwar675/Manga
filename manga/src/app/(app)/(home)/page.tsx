export const dynamic = "force-dynamic";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import HomeClient from "./home-client";
import { getQueryClient, trpc } from "@/trpc/server";

const Page = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(trpc.category.getSubMany.queryOptions()),
    queryClient.prefetchQuery(trpc.comments.getMany.queryOptions()),
    queryClient.prefetchQuery(trpc.magas.getMany.queryOptions()),
    queryClient.prefetchQuery(
      trpc.magas.getRankMonth.queryOptions({ page: 1 })
    ),
    queryClient.prefetchQuery(
      trpc.magas.getRankWeek.queryOptions({ page: 1 })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
};

export default Page;

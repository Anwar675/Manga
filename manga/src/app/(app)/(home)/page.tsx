import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import HomeClient from "./home-client";
import { getQueryClient, trpc } from "@/trpc/server";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.brand.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
};

export default Page;

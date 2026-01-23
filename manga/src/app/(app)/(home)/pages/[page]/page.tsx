import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { PageClient } from "./page-client";

const Page = async ({
  params,
}: {
  params: Promise<{ page: string }>;
}) => {
  const { page } = await params;      
  const pageNumber = Number(page) || 1;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.magas.getManga.queryOptions({ page: pageNumber })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageClient page={pageNumber} />
    </HydrationBoundary>
  );
};

export default Page;

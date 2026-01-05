
import { Navbar } from "@/modules/navabr/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";



interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.category.getMany.queryOptions()
  )

  
  

  return (
    <div className="relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Navbar  />
      </HydrationBoundary>
      {children}
    </div>
  );
};
export default Layout;

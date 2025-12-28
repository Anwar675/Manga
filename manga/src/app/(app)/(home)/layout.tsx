
import { Navbar } from "@/modules/navabr/navbar";
import { BackgroundSlider } from "@/modules/home/background-slide";
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

  void queryClient.prefetchQuery(trpc.brand.getMany.queryOptions())
  

  return (
    <div className="relative">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Navbar  />
        <BackgroundSlider  />
      </HydrationBoundary>
      {children}
    </div>
  );
};
export default Layout;

"use client"
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { MangaInfor } from "@/modules/manga/ui/manga-infor";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC()
  const {data: category} = useSuspenseQuery(trpc.category.getSubMany.queryOptions())

  return (
    <div className="2xl:px-16  bg-popular text-text-popular  w-full px-4 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb />

      <MangaInfor category={category}/>
    </div>
  );
};

export default Page;

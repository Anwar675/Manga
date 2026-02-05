"use client";
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { MangaInfor } from "@/modules/manga/ui/manga-infor";
import { Chapter } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { manga } = useParams<{ manga: string }>();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions(),
  );
  const { data: mangaData } = useSuspenseQuery(
    trpc.magas.getOne.queryOptions({ slug: manga }),
  );
  const {data: chapters} = useSuspenseQuery(trpc.chapter.getMany.queryOptions({mangaId: mangaData.id}))
  const increaseView = useMutation(
  trpc.magas.increateView.mutationOptions({
    onSuccess: () => {
      queryClient.setQueryData(
        trpc.magas.getOne.queryKey({ slug: manga }),
        (old: typeof mangaData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            views: (old.views ?? 0) + 1,
          };
        },
      );
    },
  }),
);
  useEffect(() => {
    if (!mangaData?.id) return;
    const key = `viewed-manga-${mangaData.id}`;

    
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    increaseView.mutate({
      mangaid: mangaData.id,
    });
  }, [mangaData?.id]);
 
  return (
    <div className="2xl:px-16  bg-popular text-text-popular  w-full px-4 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb />

      <MangaInfor manga={mangaData}  category={category} chapters={chapters as Chapter[]} />
    </div>
  );
};

export default Page;

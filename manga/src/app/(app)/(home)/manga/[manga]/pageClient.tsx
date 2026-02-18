"use client";

import { useEffect } from "react";
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { MangaInfor } from "@/modules/manga/ui/manga-infor";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Chapter } from "@/payload-types";

export default function PageClient({
  params,
}: {
  params: { manga: string; chapter?: string };
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  
  const { data: mangaData } = useSuspenseQuery(
    trpc.magas.getOne.queryOptions({ slug: params.manga })
  );

  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
  );

  const { data: chapters } = useSuspenseQuery(
    trpc.chapter.getMany.queryOptions({ mangaId: mangaData.id })
  );

  const chapterNumber = params.chapter
    ? parseInt(params.chapter.replace(/\D/g, ""), 10)
    : undefined;

  const increaseView = useMutation(
    trpc.magas.increateView.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(
          trpc.magas.getOne.queryKey({ slug: params.manga }),
          (old) =>
            old ? { ...old, views: (old.views ?? 0) + 1 } : old
        );
      },
    })
  );

  useEffect(() => {
    if (!mangaData?.id) return;

    const key = `viewed-manga-${mangaData.id}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    increaseView.mutate({ mangaid: mangaData.id });
  }, [mangaData?.id,increaseView]);

  return (
    <div className="xl:px-16  bg-popular text-text-popular  w-full px-4 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb
        manga={{ title: mangaData.title, slug: mangaData.slug ?? "" }}
        chapter={chapterNumber}
      />

      <MangaInfor
        manga={mangaData}
        category={category}
        chapters={chapters as Chapter[]}
      />
    </div>
  );
}

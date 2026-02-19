"use client";
import { Button } from "@/components/ui/button";

import { ChapterInfor } from "@/modules/chapter/ui/chapter-infor";
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HelpingHandIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const { manga, chapter } = useParams<{ manga: string; chapter: string }>();
  const trpc = useTRPC();
  const { data: mangaData } = useSuspenseQuery(
    trpc.magas.getOne.queryOptions({ slug: manga }, {staleTime:5 * 60_000}),
  );
  const chapterNumber = chapter
    ? parseInt(chapter.replace(/\D/g, ""), 10)
    : undefined;

  return (
    <div className="2xl:px-16  bg-popular text-text-popular  w-full px-0 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb
        manga={{ title: mangaData.title ?? "", slug: mangaData.slug ?? "" }}
        chapter={chapterNumber}
      />
      <ChapterInfor />
      <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-2">
        <Link href="/">
          <Button size="icon" className="rounded-full">
            <HelpingHandIcon size={30} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Page;

"use client";
import { Button } from "@/components/ui/button";

import { ChapterInfor } from "@/modules/chapter/ui/chapter-infor";
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HelpingHandIcon } from "lucide-react";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { manga, chapter } = useParams<{ manga: string; chapter: string }>();
  const trpc = useTRPC();
  const [show, setShow] = useState(false);
  const { data: mangaData } = useSuspenseQuery(
    trpc.magas.getOne.queryOptions({ slug: manga }, { staleTime: 5 * 60_000 }),
  );
  const { data: chapterId } = useSuspenseQuery(
    trpc.chapter.getOne.queryOptions({ slug: chapter, mangaId: mangaData.id }),
  );
  const chapterNumber = chapterId.title
    ? parseInt(chapterId.title.replace(/\D/g, ""), 10)
    : undefined;

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrolltop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="2xl:px-16  bg-popular text-text-popular  w-full px-0 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb
        manga={{ title: mangaData.title ?? "", slug: mangaData.slug ?? "" }}
        chapter={chapterNumber}
      />
      <ChapterInfor />
      <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-2">
        {show && (
          <Button size="icon" onClick={scrolltop} className="rounded-full">
            <HelpingHandIcon size={30} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Page;

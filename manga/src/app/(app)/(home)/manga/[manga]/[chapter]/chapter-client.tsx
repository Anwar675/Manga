"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpingHandIcon } from "lucide-react";
import { BreadCrumb } from "@/modules/manga/ui/breadcrum";
import { ChapterInfor } from "@/modules/chapter/ui/chapter-infor";
import { Chapter, Mangas } from "@/payload-types";

interface Props {
  mangaData: Mangas;
  chapterData: Chapter ; 
}

export default function ChapterClient({
  mangaData,
  chapterData,
}: Props) {
  const [show, setShow] = useState(false);

  const chapterNumber = chapterData.title
    ? parseInt(chapterData.title.replace(/\D/g, ""), 10)
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
    <div className="2xl:px-16 bg-popular text-text-popular w-full px-0 py-6 flex flex-col gap-8 2xl:py-8 md:px-12 md:py-6">
      <BreadCrumb
        manga={{ title: mangaData.title ?? "", slug: mangaData.slug ?? "" }}
        chapter={chapterNumber}
      />

      <ChapterInfor  />

      <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-2">
        {show && (
          <Button size="icon" onClick={scrolltop} className="rounded-full">
            <HelpingHandIcon size={30} />
          </Button>
        )}
      </div>
    </div>
  );
}
"use client"
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatime";
import { CommentsUser } from "@/modules/comments/ui/user-comment";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Bug, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export const ChapterInfor = () => {
  const { chapter, manga } = useParams<{ manga: string; chapter: string }>();
  const [list, setList] = useState(false);
  const trpc = useTRPC();
  const router = useRouter();

  const { data: mangaData } = useSuspenseQuery(
    trpc.magas.getOne.queryOptions({ slug: manga }),
  );
  const { data: ChapterMany } = useSuspenseQuery(
    trpc.chapter.getMany.queryOptions({ mangaId: mangaData.id }),
  );
  const saveHistoryMutation = useMutation(
    trpc.history.saveHistory.mutationOptions(),
  );
  const sortedChapters = [...ChapterMany].sort(
    (a, b) => a.chapterNumber - b.chapterNumber,
  );

  const currentIndex = sortedChapters.findIndex((c) => c.slug === chapter);

  const prevChapter =
    currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;

  const nextChapter =
    currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : null;

  const { data: chapterId } = useSuspenseQuery(
    trpc.chapter.getOne.queryOptions({ slug: chapter, mangaId: mangaData.id }),
  );
  useEffect(() => {
    if (!chapterId?.id || !mangaData?.id) return;
    const key = `history-${mangaData.id}`;
    const lastChapter = localStorage.getItem(key);
    if (lastChapter === chapterId.id) return;
    saveHistoryMutation.mutate({
      mangaId: mangaData.id,
      chapterId: chapterId.id,
    });
    localStorage.setItem(key, chapterId.id);
  }, [chapterId.id, mangaData.id]);
  const chapterNumber = chapterId.title
    ? parseInt(chapterId.title.replace(/\D/g, ""), 10)
    : undefined;

  return (
    <div>
      <div className="flex mt-8 bg-white py-6 dark:bg-[#242527] rounded-md items-center flex-col ">
        <div className="text-center py-4 flex gap-1 flex-col items-center">
          <h1 className="md:text-3xl text-xl font-bold">
            {mangaData.title} - Chap {chapterNumber}
          </h1>
          <div className="flex md:text-[16px] text-sm gap-4">
            <div className="flex  text-sm items-center gap-2">
              <Clock />
              <p>{formatDateTime(chapterId?.createdAt)}</p>
            </div>
          </div>
          <p className="text-center py-2 mx-12 md:px-0 px-8 bg-rank w-full">
            {" "}
            Sử dụng mũi tên trái (←) hoặc phải (→) để chuyển chapter
          </p>
          <Button className="flex mt-4">
            <Bug />
            <p>Báo Lỗi</p>
          </Button>
          <div className="flex gap-4 mt-4 md:mt-8">
            <Button
              size="lg"
              onClick={() =>
                prevChapter &&
                router.push(`/manga/${manga}/${prevChapter.slug}`)
              }
              className={`${!prevChapter ? "" : " bg-amber-500 text-[#6d3c27]"}`}
              variant="chapterActive"
            >
              <ArrowLeft />
              <p>Chap trước</p>
            </Button>
            <Button
              size="lg"
              variant="chapterActive"
              onClick={() =>
                nextChapter &&
                router.push(`/manga/${manga}/${nextChapter.slug}`)
              }
              className={`${!nextChapter ? "" : " bg-amber-500 text-[#6d3c27]"}`}
            >
              <p>Chap sau</p>
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="bg-popular w-full">
          {chapterId.pages.map((page, index) => {
            const imageUrl =
              typeof page.image === "string"
                ? page.image
                : page.image?.url || "/img/error.webp";

            return (
              <div key={index} className="md:w-225 w-full relative mx-auto ">
                <Image
                  src={imageUrl}
                  width={1000}
                  unoptimized
                  height={1200}
                  priority={index < 2} // preload 2 ảnh đầu
                  className="w-full h-auto object-contain"
                  alt={`Page ${index + 1}`}
                />
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 items-center mt-4">
          <Button size="lg" variant="chapterActive">
            <ArrowLeft />
            <p>Chap trước</p>
          </Button>
          <div
            onClick={() => setList(!list)}
            className="relative px-2 py-1 cursor-pointer bg-popular"
          >
            <div className="flex gap-1 md:w-40 w-full text-[18px] justify-between  items-center ">
              <p className="py-1">Chap {chapterNumber}</p>
              <ChevronDown size={18} />
            </div>
            {list && (
              <div className="fixed  md:m-0 m-4 md:absolute  md:bottom-11 text-[18px]  md:left-0 md:right-0 md:inset-auto inset-0 z-99 md:z-10 flex items-center justify-center">
                <div
                  className="
        w-full 
        max-h-210
        flex flex-col 
        overflow-y-auto rounded-md
        bg-popular
      "
                >
                  {ChapterMany.length > 1 &&
                    ChapterMany.map((chap) => (
                      <Link key={chap.id} href={`/manga/${manga}/${chap.slug}`}>
                        <p className="hover:bg-gray-200 md:px-2  border-b border-b-amber-800 px-4 py-2">
                          Chap {chap.chapterNumber}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
          <Button
            size="lg"
            variant="chapterActive"
            onClick={() =>
              nextChapter && router.push(`/manga/${manga}/${nextChapter.slug}`)
            }
            className={`${!nextChapter ? "" : " bg-amber-500 text-[#6d3c27]"}`}
          >
            <p>Chap sau</p>
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <CommentsUser targetId={chapterId.id} targetType="chapters" />
      </div>
    </div>
  );
};

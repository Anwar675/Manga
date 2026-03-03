import { createCaller } from "@/trpc/server";
import { notFound } from "next/navigation";
import ChapterClient from "./chapter-client";

export const revalidate = 120; // cache 60s

export default async function Page({
  params,
}: {
  params:Promise<{ manga: string; chapter: string }>;
}) {

  const {manga, chapter} = await params

  const caller = await createCaller();

  const mangaData = await caller.magas.getOne({
    slug: manga,
  });

  if (!mangaData) {
    return notFound();
  }

  // Lấy chapter
  const chapterData = await caller.chapter.getOne({
    slug: chapter,
    mangaId: mangaData.id,
  });

  if (!chapterData) {
    return notFound();
  }

  return (
    <ChapterClient
      mangaData={mangaData}
      chapterData={chapterData}
    />
  );
}
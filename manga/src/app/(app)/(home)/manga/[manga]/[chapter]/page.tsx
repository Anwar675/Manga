import { notFound } from "next/navigation";
import ChapterClient from "./chapter-client";
import { getChapterData } from "@/lib/get-chapter";

export const revalidate = 120;

export default async function Page({
  params,
}: {
  params: Promise<{ manga: string; chapter: string }>;
}) {
  const {manga, chapter} = await params
  const data = await getChapterData(manga,chapter);

  if (!data) return notFound();

  return (
    <ChapterClient
      mangaData={data.manga}
      chapterData={data.chapter}
    />
  );
}
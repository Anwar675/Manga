import { notFound } from "next/navigation";
import ChapterClient from "./chapter-client";

export const revalidate = 120;

async function getChapter(manga: string, chapter: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/chapter?manga=${manga}&chapter=${chapter}`,
    {
      next: { revalidate: 120 },
    }
  );

  if (!res.ok) return null;

  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ manga: string; chapter: string }>;
}) {
  const { manga, chapter } = await params;

  const data = await getChapter(manga, chapter);

  if (!data) return notFound();

  return (
    <ChapterClient
      mangaData={data.manga}
      chapterData={data.chapter}
    />
  );
}
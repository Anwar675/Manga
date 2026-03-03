import { NextResponse } from "next/server";
import { createCaller } from "@/trpc/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const manga = url.searchParams.get("manga");
  const chapter = url.searchParams.get("chapter");

  if (!manga || !chapter) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const caller = await createCaller();

  const mangaData = await caller.magas.getOne({ slug: manga });
  if (!mangaData) {
    return NextResponse.json({ error: "Manga not found" }, { status: 404 });
  }

  const chapterData = await caller.chapter.getOne({
    slug: chapter,
    mangaId: mangaData.id,
  });

  if (!chapterData) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json({
    manga: mangaData,
    chapter: chapterData,
  });
}
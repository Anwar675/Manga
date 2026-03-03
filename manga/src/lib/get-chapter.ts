// lib/get-chapter.ts

import { getPayloadClient } from "./payload";


export async function getChapterData(manga: string, chapter: string) {
  const payload = await getPayloadClient();

  const mangaDoc = await payload.find({
    collection: "mangas",
    where: {
      slug: { equals: manga },
    },
    limit: 1,
  });

  if (!mangaDoc.docs.length) return null;

  const chapterDoc = await payload.find({
    collection: "chapters",
    where: {
      slug: { equals: chapter },
      manga: { equals: mangaDoc.docs[0].id },
    },
    limit: 1,
  });

  if (!chapterDoc.docs.length) return null;

  return {
    manga: mangaDoc.docs[0],
    chapter: chapterDoc.docs[0],
  };
}
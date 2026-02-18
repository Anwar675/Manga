import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatime";
import { Chapter } from "@/payload-types";
import Link from "next/link";

interface ChaptersProps {
  chapters: Chapter[];
}

export const Chapters = ({ chapters }: ChaptersProps) => {
  const firstChapter = chapters?.[0];

  const firstMangaSlug =
    typeof firstChapter?.manga === "string"
      ? undefined
      : firstChapter?.manga?.slug;

  return (
    <div className="bg-rank relative rounded-2xl max-h-143.5 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b-2 rounded-t-2xl border-kind flex md:flex-row flex-col justify-between px-4 py-2 gap-2 items-center">
        <h1 className="font-bold">DANH SÁCH CHƯƠNG</h1>

        {firstChapter && firstMangaSlug && (
          <Link href={`/manga/${firstMangaSlug}/${firstChapter.slug}`}>
            <Button className="rounded-4xl">Đọc từ đầu</Button>
          </Link>
        )}
      </div>

      {chapters.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          Chưa có chương nào
        </div>
      )}

      {/* Chapter list */}
      <div className="flex flex-col gap-2">
        {chapters.map((chapter) => {
          const mangaSlug =
            typeof chapter.manga === "string"
              ? undefined
              : chapter.manga?.slug;

          if (!mangaSlug) return null;

          return (
            <div
              key={chapter.id}
              className="flex justify-between px-4 py-2"
            >
              <Link href={`/manga/${mangaSlug}/${chapter.slug}`}>
                <p className="hover:underline cursor-pointer">
                  {chapter.title}
                </p>
              </Link>

              <p>{formatDate(chapter.createdAt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

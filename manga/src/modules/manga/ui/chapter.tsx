import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatime";
import { Chapter } from "@/payload-types";
import Link from "next/link";

interface ChaptersProps {
  chapters: Chapter[];
}

export const Chapters = ({ chapters }: ChaptersProps) => {
  return (
    <div className="bg-rank relative rounded-2xl max-h-143.5 overflow-auto">
      <div className="sticky top-0 z-10 border-b-2 rounded-t-2xl border-kind flex md:flex-row flex-col justify-between px-4 py-2 gap-2 items-center">
        <h1 className="font-bold">DANH SÁCH CHƯƠNG</h1>
        <Button className="rounded-4xl">Đọc từ đầu</Button>
      </div>
      <div className="flex flex-col gap-2  ">
        {chapters.map((chapter) => {
          const mangaSlug =
            typeof chapter.manga === "string" ? null : chapter.manga?.slug;

          return (
            <div className="flex justify-between px-4 py-2">
              <Link
                href={`/manga/${mangaSlug}/${chapter.slug}`}
              >
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

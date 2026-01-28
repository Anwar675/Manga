"use client";
import { BookMarked } from "lucide-react";
import { CardMangaItems } from "./card-mangaItems";

import { rankcolor } from "@/lib/rankColor";
import { RankCard } from "./rank-card";
import { Category, Mangas } from "@/payload-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NewUpdateProps {
  category: Category[];
  mangas: Mangas[];
  page?: number;
  totalPages?: number;
}

export const NewUpdate = ({
  category,
  mangas,
  page,
  totalPages,
}: NewUpdateProps) => {
  const pathname = usePathname();
  const isPaging = pathname.startsWith("/pages/");

  if (!mangas?.length) {
    return null;
  }
  const currentPage = page ?? 1;
  const maxPage = totalPages ?? 1;
  const MAX_PAGES = 5;

  let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGES / 2));
  let endPage = startPage + MAX_PAGES - 1;

  if (endPage > maxPage) {
    endPage = maxPage;
    startPage = Math.max(1, endPage - MAX_PAGES + 1);
  }
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(maxPage, currentPage + 1);

  return (
    <div className=" 2xl:px-16 md:flex block justify-between  w-full px-4 py-6  2xl:py-8 md:px-12 md:py-6">
      <div className="flex-1">
        <div className="flex items-center">
          <h1 className="font-bold pr-7">TRUYỆN MỚI CẬP NHẬP</h1>
          <div className="flex-1 h-px bg-text-popular" />
        </div>
        <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-4">
          {mangas.map((manga) => (
            <Link key={manga.id} href={`/manga/${manga.slug}`}>
              <CardMangaItems key={manga.id} newCard manga={manga} />
            </Link>
            
          ))}
        </div>
        <div className="text-center relative my-4">
          {isPaging && page && totalPages ? (
            <div className="flex justify-center items-center gap-2 mt-4">
              {currentPage <= 1 ? (
                <Button variant="outline" size="sm" disabled>
                  ‹
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/pages/${prevPage}`}>‹</Link>
                </Button>
              )}

              {/* Page numbers */}
              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i,
              ).map((p) =>
                p === currentPage ? (
                  <Button key={p} size="sm" disabled>
                    {p}
                  </Button>
                ) : (
                  <Button key={p} size="sm" variant="outline" asChild>
                    <Link href={`/pages/${p}`}>{p}</Link>
                  </Button>
                ),
              )}

              {/* Next */}
              {currentPage >= maxPage ? (
                <Button variant="outline" size="sm" disabled>
                  ›
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/pages/${nextPage}`}>›</Link>
                </Button>
              )}
            </div>
          ) : (
            <Button>
              <Link href="/pages/2">Xem thêm</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col  gap-4">
        <div className="rounded-md ml-0 md:ml-8 md:w-90 w-full h-100 bg-rank flex flex-col">
          <div className="sticky top-0 z-10 bg-rank py-2 rounded-t-2xl font-bold text-center">
            TOP 10 TRUYỆN HOT NHẤT
          </div>

          <div className="flex-1 py-4 overflow-auto no-scrollbar flex flex-col gap-3  px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((manga, index) => {
              const rank = index + 1;
              const rankColor = rankcolor[rank] ?? "text-blue-400";
            return <RankCard key={index} rank={rank} rankColor={rankColor} />;
            })}
          </div>
        </div>
        <div className="rounded-md ml-0 md:ml-8 md:w-90 w-full h-100 bg-rank flex flex-col">
          <div className="flex justify-between bg-kind rounded-t-md p-4">
            <h1 className="font-bold text-xl">Thể loại</h1>
            <BookMarked />
          </div>
          <div className="relative gap-2 h-78 overflow-auto no-scrollbar  p-4 flex flex-wrap ">
            {category.map((subcategory: Category) => (
              <p
                key={subcategory.id}
                className="px-2 cursor-pointer py-1 rounded-md whitespace-nowrap bg-kind"
              >
                {subcategory.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { CardMangaItems } from "./card-mangaItems";


import { Category, Mangas } from "@/payload-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RankKind } from "@/modules/manga/ui/rank-kind";

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
  const titleMap: Record<string, string> = {
    "/ranking/top-daily": "TOP TRUYỆN NGÀY",
    "/ranking/top-week": "TOP TRUYỆN TUẦN",
    "/ranking/top-month": "TOP TRUYỆN THÁNG",
    "/ranking/top-all-time": "TOP MỌI THỜI ĐẠI ",
    "/follow": "TRUYỆN BẠN THEO DÕI",
    "/history": "TRUYỆN BẠN ĐÃ XEM"
  };

  const title =
    Object.entries(titleMap).find(([path]) => pathname.startsWith(path))?.[1] ??
    "TRUYỆN MỚI CẬP NHẬP";
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
           <h1 className="font-bold pr-7">{title}</h1>

          <div className="flex-1 h-px bg-text-popular" />
        </div>
        <div className="grid md:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-4">
          {mangas.map((manga) => (
            <Link key={manga.id} href={`/manga/${manga.slug}`}>
              <CardMangaItems newCard manga={manga} />
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
              <Link href="/pages/1">Xem thêm</Link>
            </Button>
          )}
        </div>
      </div>
      <RankKind category={category} />
    </div>
  );
};

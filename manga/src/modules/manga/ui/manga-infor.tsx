import { Category, Mangas, Rating } from "@/payload-types";
import Image from "next/image";
import { RankKind } from "./rank-kind";
import { Badge, Bookmark, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { RichText } from "@payloadcms/richtext-lexical/react";


import type { SerializedEditorState, SerializedLexicalNode } from "lexical";


import type { RouterOutputs } from "@/trpc/init";
import { formatDate, formatViews } from "@/lib/formatime";

type MangaDetail = RouterOutputs["magas"]["getOne"];

interface MangaInforProps {
  category: Category[];
  manga: MangaDetail;
}

export const MangaInfor = ({ category, manga }: MangaInforProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const ratingManga = useMutation(
    trpc.magas.ratingManga.mutationOptions({
      onSuccess: async () => {
        setSelect(null); // reset sao đã chọn
        setHoverStar(null); // reset hover

        await queryClient.invalidateQueries(
          trpc.magas.getOne.queryFilter({ slug: manga.slug! }),
        );
      },
    }),
  );

  const ratingAvg = manga.rating?.avg ?? 0;
  const [expanded, setExpanded] = useState(false);
  const [hoverStar, setHoverStar] = useState<number | null>(null);

  const [select, setSelect] = useState<number | null>(null);
  const handleStar = (star: number) => {
    setSelect(star);
    ratingManga.mutate({
      mangaId: manga.id,
      star,
    });
  };

  return (
    <div className="flex md:flex-row flex-col gap-4 justify-between">
      <div className="bg-rank flex md:flex-row flex-col md:gap-2 gap-4 rounded-xl w-full p-4">
        <div className="text-center">
          <div className="md:w-92.5 w-full h-120 relative md:h-125">
            <Image
              src="/img/backgorun.jpg"
              alt={manga.title}
              fill
              className="rounded-xl object-cover"
            />
          </div>
          <div className="p-4 flex gap-4 justify-around items-center">
            <Button className="flex-1">
              <Bookmark />
              <h2>THEO DÕI TRUYỆN</h2>
            </Button>
            <p className="text-xl">{manga.followers} theo dõi</p>
          </div>
        </div>

        <div className="flex-col md:px-6 px-0 flex-1 gap-2.5 flex">
          <p className="text-2xl font-medium">{manga.title}</p>

          <div className="flex gap-1 items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const displayValue =
                hoverStar !== null
                  ? hoverStar
                  : select !== null
                    ? select
                    : ratingAvg;

              const isFull = star <= Math.floor(displayValue);
              const isHalf =
                star === Math.floor(displayValue) + 1 &&
                displayValue % 1 >= 0.5;

              return (
                <div
                  key={star}
                  className="relative w-5.5 h-5.5 cursor-pointer"
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(null)}
                  onClick={() => handleStar(star)}
                >
                  <Star size={22} className="absolute " />

                  {isFull && (
                    <Star
                      size={22}
                      className="absolute fill-yellow-500 text-yellow-500 pointer-events-none"
                    />
                  )}

                  {/* sao nửa */}
                  {isHalf && (
                    <Star
                      size={22}
                      className="absolute fill-yellow-500 text-yellow-500 pointer-events-none"
                      style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                  )}
                </div>
              );
            })}

            <span className="ml-2 text-md ">{ratingAvg.toFixed(1)} / 5</span>
          </div>

          <div className="flex md:flex-row flex-col pr-8 justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <p className="font-medium">Tác giả:</p>
                <p>
                  {typeof manga.author === "string"
                    ? manga.author
                    : manga.author?.name}
                </p>
              </div>
              <div className="flex gap-1">
                <p className="font-medium">Nhóm dịch:</p>
                <p>
                  <p>
                    {typeof manga.owner === "string"
                      ? manga.owner
                      : manga.owner.username}
                  </p>
                </p>
              </div>
              <div className="flex gap-1">
                <p className="font-medium">Tổng số chap:</p>
                <p>40</p>
              </div>
              <div className="flex gap-1">
                <p className="font-medium">Độ tuổi:</p>
                <p className="px-2 rounded-2xl bg-kind">{manga.ageRating}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <p className="font-medium">Tình trạng:</p>
                <p>{manga.status}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-medium">Ngày tạo:</p>
                <p>{formatDate(manga.createdAt)}</p>
              </div>
              <div className="flex gap-1">
                <p className="font-medium">Lượt xem:</p>
                <p className="px-2 rounded-2xl bg-kind">{formatViews(manga.views)}</p>
              </div>
            </div>
          </div>
          <p className="font-medium text-xl">Thể loại</p>
          <div className="relative gap-2 flex flex-wrap ">
            {manga.genres.map((genre) => (
              <p
                key={typeof genre === "string" ? genre : genre.id}
                className="px-2 cursor-pointer py-1 rounded-md whitespace-nowrap bg-kind"
              >
                {typeof genre === "string" ? genre : genre.name}
              </p>
            ))}
          </div>
          <div className="flex text-[16px] items-center font-bold">
            <Badge />
            <p className="px-2">Giới thiệu</p>
          </div>
          <div
            className={`
          relative
          overflow-hidden
          transition-all
          duration-300
          ${expanded ? "max-h-full" : "max-h-32"}
        `}
          >
            {manga.description && (
              <RichText
                data={
                  manga.description as unknown as SerializedEditorState<SerializedLexicalNode>
                }
              />
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-bold cursor-pointer hover:underline self-start"
          >
            {expanded ? "Thu gọn" : "Xem thêm"}
          </button>
        </div>
      </div>

      <RankKind category={category} />
    </div>
  );
};

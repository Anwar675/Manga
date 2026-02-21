"use client";

import { ScrollTop } from "@/modules/advend_UI/scroll-top";
import { AdminChat } from "@/modules/comments/ui/admin-chat";
import { BackgroundSlider } from "@/modules/home/background-slide";
import { HotManga } from "@/modules/home/ui/hot-maga";
import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Popular } from "@/modules/home/ui/popular";
import { Category, Comment, Mangas } from "@/payload-types";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

type SectionKey = "top" | "popular" | "newUpdate" | "adminChat";

type Props = {
  category: Category[];
  comments: {
    docs: Comment[];
  };
  mangas: Mangas[];
};

export default function HomeClient({
  category,
  comments,
  mangas,
}: Props) {
  const trpc = useTRPC();

  // ✅ không dùng Suspense nữa
  const { data: rankMonth } = useQuery(
    trpc.magas.getRankMonth.queryOptions({ page: 1 })
  );

  const { data: rankWeek } = useQuery(
    trpc.magas.getRankWeek.queryOptions({ page: 1 })
  );

  const popularRef = useRef<HTMLDivElement>(null);
  const newUpdateRef = useRef<HTMLDivElement>(null);
  const adminChatRef = useRef<HTMLDivElement>(null);

  const scrollTo = (section: SectionKey) => {
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const map = {
      popular: popularRef,
      newUpdate: newUpdateRef,
      adminChat: adminChatRef,
    };

    map[section]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative bg-popular text-text-popular">
      <BackgroundSlider />

      <div ref={popularRef}>
        <Popular mangas={rankWeek?.docs as Mangas[]} />
      </div>

      <div ref={newUpdateRef}>
        <NewUpdate category={category} mangas={mangas} />
      </div>

      <div ref={adminChatRef}>
        <AdminChat comments={comments.docs} />
      </div>

      <div>
        <HotManga mangas={rankMonth?.docs as Mangas[]} />
      </div>

      <ScrollTop onScroll={scrollTo} />
    </div>
  );
}
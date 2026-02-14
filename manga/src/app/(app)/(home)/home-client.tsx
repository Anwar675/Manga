"use client";
import { ScrollTop } from "@/modules/advend_UI/scroll-top";
import { AdminChat } from "@/modules/comments/ui/admin-chat";
import { BackgroundSlider } from "@/modules/home/background-slide";

import { HotManga } from "@/modules/home/ui/hot-maga";
import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Popular } from "@/modules/home/ui/popular";
import { Comment, Mangas } from "@/payload-types";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";

type SectionKey = "top" | "popular" | "newUpdate" | "adminChat";

export default function HomeClient() {
  const trpc = useTRPC();
  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
  );
  const {data: comments} = useSuspenseQuery(trpc.comments.getMany.queryOptions())
  const {data: mangas} = useSuspenseQuery(trpc.magas.getMany.queryOptions())
  const {data: rankMonth} = useSuspenseQuery(trpc.magas.getRankMonth.queryOptions(
    {
      page:1
    }
  ))
  const {data: mangaRank} = useSuspenseQuery(trpc.magas.getRankWeek.queryOptions({
    page: 1
  }))
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
        <Popular mangas={mangaRank.docs} />
      </div>

      <div ref={newUpdateRef}>
        <NewUpdate category={category} mangas={mangas as Mangas[]} />
      </div>

      <div ref={adminChatRef}>
        <AdminChat comments={comments.docs as Comment[]} />
      </div>
      <div>
        <HotManga mangas={rankMonth.docs} />
      </div>
      
      <ScrollTop onScroll={scrollTo} />
    </div>  );
}

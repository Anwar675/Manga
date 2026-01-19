"use client";
import { ScrollTop } from "@/modules/advend_UI/scroll-top";
import { AdminChat } from "@/modules/comments/ui/admin-chat";
import { BackgroundSlider } from "@/modules/home/background-slide";
import { Footer } from "@/modules/home/ui/footer";
import { HotManga } from "@/modules/home/ui/hot-maga";
import { NewUpdate } from "@/modules/home/ui/newUpdate";
import { Popular } from "@/modules/home/ui/popular";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "react";

type SectionKey = "top" | "popular" | "newUpdate" | "adminChat";

export default function HomeClient() {
  const trpc = useTRPC();
  const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
  );
  const {data: mangas} = useSuspenseQuery(trpc.magas.getMany.queryOptions())
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
  console.log(mangas);
  return (
    <div className="relative bg-popular text-text-popular">
      <BackgroundSlider />
      <div ref={popularRef}>
        <Popular mangas={mangas} />
      </div>

      <div ref={newUpdateRef}>
        <NewUpdate category={category} mangas={mangas} />
      </div>

      <div ref={adminChatRef}>
        <AdminChat />
      </div>
      <div>
        <HotManga mangas={mangas} />
      </div>
      <Footer />
      <ScrollTop onScroll={scrollTo} />
    </div>
  );
}

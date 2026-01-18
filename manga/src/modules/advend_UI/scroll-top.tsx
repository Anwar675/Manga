"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, Bell, Flame, HelpingHandIcon, MessageCircleIcon, Star } from "lucide-react";
import { useState } from "react";


type sectionKey = "top" | "popular" | "newUpdate" | "adminChat";

export const ScrollTop = ({onScroll}: {
  onScroll: (section:sectionKey) => void
}) => {
  
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-10 right-6 z-50 flex flex-col items-end gap-2">
     
      <div
        className={`
          flex flex-col gap-2 mb-2
          transition-all duration-200 ease-out
          ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <Button size="icon" title="Popular" onClick={() => onScroll("popular")}>
          <Star size={18} />
        </Button>
        <Button size="icon" title="Mới cập nhật" onClick={() => onScroll("newUpdate")}>
          <Flame size={18} />
        </Button>
        <Button size="icon" title="Thông báo" onClick={() => onScroll("adminChat")}>
          <Bell size={18} />
        </Button>
        <Button size="icon" title="Lên đầu trang" onClick={() => onScroll("top")}>
          <ArrowUp size={18} />
        </Button>
      </div>

      
      <Button
        size="icon"
        className="rounded-full"
        onClick={() => setOpen((v) => !v)}
      >
        <HelpingHandIcon size={30} />
      </Button>
    </div>
  );
};

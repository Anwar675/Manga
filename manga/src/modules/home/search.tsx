"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-search";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Search = () => {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 300);
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.magas.search.queryOptions(
      { query: debounced },
      { enabled: debounced.length > 0 },
    ),
  );
  return (
    <div className="relative w-full ">
      <Input
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-base1 text-foreground placeholder:text-foreground/50 font-light pr-8 2xl:pr-12 md:w-60 w-full "
      />
      {!value ? (
        <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-4 " />
      ) : (
        <XIcon
          onClick={() => setValue("")}
          className="absolute top-1/2 -translate-y-1/2 right-2 text-base1/20"
        />
      )}

      {value && data && data.length > 0 && (
        <div className="absolute bg-popular  md:top-14 top-10 z-20 left-0 w-full md:w-80 rounded-sm max-h-100 overflow-auto">
          {data.map((manga) => (
            <Link
              key={manga.id}
              onClick={() => {
                setValue(manga.title);
                setTimeout(() => setValue(""), 100);
              }}
              href={`/manga/${manga.slug}`}
            >
              <div className="flex cursor-pointer hover:bg-gray-600/10 p-2 gap-4 ">
                <div className="relative h-15 w-15  ">
                  <Image
                    src={
                      typeof manga.cover === "string"
                        ? manga.cover
                        : (manga.cover?.url ?? "/images/manga-placeholder.jpg")
                    }
                    width={60}
                    height={60}
                    className="object-cover h-15 w-15"
                    alt={manga.title}
                    
                  />
                </div>
                <div>
                  <h4 className="text-[18px] font-medium">{manga.title}</h4>
                  <p className="text-sm text-gray-400">
                    Chap {manga.latestChapter?.number}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          
        </div>
      )}
    </div>
  );
};

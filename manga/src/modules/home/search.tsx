"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const Search = () => {
  const [value, setValue] = useState("");
  return (
    <div className="relative w-full">
      <Input
        placeholder="Tìm kiếm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="text-base1 font-light pr-8 2xl:pr-12 md:w-60 w-full "
      />
      {!value ? (
        <SearchIcon className="absolute top-1/2 -translate-y-1/2 right-2 text-[#cdcdcd]" />
      ) : (
        <XIcon
          onClick={() => setValue("")}
          className="absolute top-1/2 -translate-y-1/2 right-2 text-[#74777a]"
        />
      )}
    </div>
  );
};

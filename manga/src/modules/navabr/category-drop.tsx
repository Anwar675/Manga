"use client";
import { Category } from "@/payload-types";
import { useRef, useState } from "react";
import { UsePosition } from "./use-position";
import { SubcategoryMenu } from "./subcategory-menu";
import Link from "next/link";

interface Props {
  category: Category;
  isActive?: boolean;
}

export const CategoryDropdown = ({ category }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropPosition } = UsePosition(dropdownRef, {
    category,
    columnWidth: 100,
    gap: 16,
  });
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };
  return (
    <div
      className="text-base1 relative cursor-pointer"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="2xl:text-xl md:text-[12px] xl:text-[16px]">
        <Link href="/">
          {category.name}
        </Link>
      </div>

      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={getDropPosition()}
      />
    </div>
  );
};

import { Category } from "@/payload-types";
import Link from "next/link";

interface SubcategoryMenuProps {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number; width: number; columns?: number };
}

export const SubcategoryMenu = ({
  category,
  isOpen,
  position,
}: SubcategoryMenuProps) => {
  
  if (
    !isOpen ||
    !Array.isArray(category.subcategories) ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="fixed z-50"
      style={{ top: position.top, left: position.left, width: position.width }}
    >
      <div className="h-3 w-full" />
      <div
        className="w-full bg-[#FCF3E4]  grid  rounded-md overflow-hidden border"
        style={{
          gridTemplateColumns: `repeat(${position.columns}, 1fr)`,
        }}
      >
        {category.subcategories?.map((subcategory: Category) => (
          <Link
            key={subcategory.slug}
            href={`/${subcategory.slug}`}
            className="w-full flex text-md  2xl:text-[16px] hover:bg-[#cfccb3] p-4 items-center text-left font-light text-[#4f4c40] "
          >
            {subcategory.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

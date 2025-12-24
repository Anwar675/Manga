import { Category } from "@/payload-types";
import Link from "next/link";

interface SubcategoryMenuProps {
    category: Category
    isOpen: boolean
    position: {top: number,  left: number, width: number, columns?: number}
    
}

export const SubcategoryMenu = ({
    category,
    isOpen,
    position
}: SubcategoryMenuProps) => {
    const columns = position.columns ?? 1 
    if(!isOpen || !category.subcategories) {
        return null
    }
    
    return (
        <div className="fixed z-50" style={{top:position.top, left:position.left, width: position.width}}>
            <div className="h-3 w-full" />
            <div className="w-full bg-amber-600 grid p-4 rounded-md overflow-hidden border" style={{
                    gridTemplateColumns: `repeat(${position.columns}, 1fr)`,
        }}>
                {category.subcategories?.map((subcategory:Category) => (
                    <Link key={subcategory.slug} href="/" className="w-full flex text-sm 2xl:text-[16px] py-2 items-center text-left font-light text-white "> 
                        {subcategory.name}
                    </Link>
                ))}   
            </div>
        </div>
    )
}
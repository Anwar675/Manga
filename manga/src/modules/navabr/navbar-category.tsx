import { Category } from "@/payload-types"
import { CategoryDropdown } from "./category-drop"

interface NavbarCategoryProps {
    data: Category[]
}
export const NavbarCategory = ({data}: NavbarCategoryProps) => {
    
    return (
        <div className="flex gap-6">
            {data.map((category: Category) => (
                <div key={category.id}>
                    <CategoryDropdown category={category}  isActive={false}  />
                </div>
            ))}
        </div>
    )
}
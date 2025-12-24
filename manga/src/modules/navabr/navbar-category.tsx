import { Category } from "@/payload-types"
import { CategoryDropdown } from "./category-drop"

interface NavbarCategoryProps {
    data: any
}
export const NavbarCategory = ({data}: NavbarCategoryProps) => {
    console.log(data)
    return (
        <div>
            {data.map((category: Category) => (
                <div key={category.id}>
                    <CategoryDropdown category={category}  isActive={false}  />
                </div>
            ))}
        </div>
    )
}
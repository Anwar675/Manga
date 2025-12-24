import { RefObject } from "react"
import { Category } from "@/payload-types"

interface Options {
  category: Category
  columnWidth?: number
  gap?: number
  mobileBreakpoint?: number
  singleColumnWidth?: number
}

export const UsePosition = (
  ref: RefObject<HTMLDivElement | null>,
  options: Options
) => {
  const {
    category,
    columnWidth = 120,
    gap = 16,
    mobileBreakpoint = 768,
    singleColumnWidth = 240,
  } = options

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.innerWidth < mobileBreakpoint

  const getColumns = () => {
    if (typeof window === "undefined") return 1

    if (isMobile()) return 2

    if (category.slug === "genres") return 5

    return 1
  }

  const getDropPosition = () => {
    if (!ref.current || typeof window === "undefined") {
      return {
        top: 0,
        left: 0,
        width: singleColumnWidth,
        columns: 1,
      }
    }

    const rect = ref.current.getBoundingClientRect()
    const columns = getColumns()

    // ⭐ MOBILE → FULL WIDTH
    if (isMobile()) {
      return {
        top: rect.bottom + window.scrollY,
        left: 0,
        width: window.innerWidth,
        columns,
      }
    }

    // DESKTOP
    const dropdownWidth =
      columns === 1
        ? singleColumnWidth
        : columns * columnWidth + (columns - 1) * gap

    let left = rect.left + window.scrollX
    const top = rect.bottom + window.scrollY

    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth
    }

    if (left < 16) left = 16

    return {
      top,
      left,
      width: dropdownWidth,
      columns,
    }
  }

  return { getDropPosition }
}

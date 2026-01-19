import { CardManga } from "./card-maga"
import { Mangas } from "@/payload-types"

interface PopularProps {
    mangas?: Mangas[]
}

export const Popular = ({ mangas }: PopularProps) => {
    return (
        <div className="2xl:px-16   w-full px-4 py-6  2xl:pt-8 2xl:pb-4 md:px-12 md:py-6">
            <div className="flex items-center">
                <h1 className="font-bold pr-7">TRUYỆN PHỔ BIẾN</h1>
                
                <div className="flex-1 h-px bg-text-popular" />
            </div>
            <CardManga mangas={mangas} />

        </div>
    )
}
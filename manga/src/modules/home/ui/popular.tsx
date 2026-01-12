import { CardManga } from "./card-maga"

export const Popular = () => {
    return (
        <div className="2xl:px-16   w-full px-4 py-6  2xl:py-8 md:px-12 md:py-6">
            <div className="flex items-center">
                <h1 className="font-bold pr-7">TRUYỆN PHỔ BIẾN</h1>
                
                <div className="flex-1 h-px bg-text-popular" />
            </div>
            <CardManga />

        </div>
    )
}
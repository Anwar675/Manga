import { CardManga } from "./card-maga"

export const HotManga = () => {
    return (
        <div className="2xl:px-16   w-full px-4 py-6 mt-14  2xl:py-8 md:px-12 md:py-6">
            <div className="flex items-center">
                <div className="flex-1 h-px bg-text-popular" />

                <h1 className="font-bold px-4">TRUYỆN HOT THÁNG NÀY</h1>
                
                <div className="flex-1 h-px bg-text-popular" />
            </div>
            <CardManga />

        </div>
    )
}
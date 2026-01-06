import { cn } from "@/lib/utils"
import { Eye, Star } from "lucide-react"
import Image from "next/image"

export const CardMangaItems = () => {
    return (
        <div className="py-4  cursor-pointer ">
            <div className="relative h-55 ">
                <Image src="/img/card1.jpg" alt="card" fill className="rounded-t-xl" />
            </div>
            <p className="truncate px-2">Natra ma đồng náo hải 2</p>
            <div className="flex px-2 justify-between items-center">
                <div className="flex gap-0.5 items-center">
                    {[1,2,3,4,5].map((index) => (
                        <Star size={12} className={cn(" text-yellow-500", index >= 4 ? "fill-white" : " fill-yellow-500" )} />
                    ))}
                    <p className="text-yellow-600  text-sm">4.5/5</p>
                </div>
                <div className="flex items-center text-sm text-view">
                    <Eye size={20} className="fill-gray-400" />
                    <p>12.5k</p>
                </div>
            </div>
        </div>
    )
}
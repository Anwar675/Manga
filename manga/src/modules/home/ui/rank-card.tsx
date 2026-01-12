import { Eye, Heart, MessageCircleIcon } from "lucide-react"
import Image from "next/image"


interface RankCardProps {
    rankColor:string;
    rank: number
}

export const RankCard = ({rankColor, rank}: RankCardProps) => {
    return (
        <div className="flex items-center gap-4 cursor-pointer ">
              <p className={`text-5xl ${rankColor} p-1 w-12 italic font-bold`}>{rank}</p>
              <Image src="/img/rank.png" alt='rank' width={40} height={40} />
              <div> 
                  <h2 className="text-md font-medium">La tiểu hắc chiến ký 2</h2>
                  <div className="flex items-center gap-2 text-view">

                    <div className="flex text-sm items-center  ">
                        <Eye size={16} className="fill-gray-400"/>
                        <p>12.5k</p>
                    </div>
                    <div className="flex text-sm items-center">
                        <MessageCircleIcon size={16} className="fill-[#9da2a8]"/>
                        <p>12.5k</p>
                    </div>
                    <div className="flex text-sm items-center">
                        <Heart size={16} className="fill-gray-400" />
                        <p>12.5k</p>
                    </div>
                  </div>
              </div>
            </div>
    )
}
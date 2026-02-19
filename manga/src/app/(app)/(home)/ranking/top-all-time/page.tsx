"use client"

import { Button } from "@/components/ui/button"
import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"

import Link from "next/link"



const Page = () => {
    const trpc = useTRPC()
   
    
    const {data: manga} = useSuspenseQuery(trpc.magas.getRankDay.queryOptions({
        page: 1
    }))
    const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
    )
    return (
        <div className="bg-popular">
            <div className="flex pt-10 justify-around">
                <Link href="/ranking/top-daily">

                    <Button className="px-5">
                        Top Ngày
                    </Button>
                </Link>
                <Link href="/ranking/top-monthly">
                    <Button className="px-5">
                        Top Tháng
                    </Button>
                </Link>
                <Link href="/ranking/top-weekly">
                    <Button className="px-5">
                        Top Tuần
                    </Button>
                </Link>
            </div>
            <NewUpdate mangas={manga.docs as Mangas[]} category={category} page={manga.page} totalPages={manga.totalPages} />
        </div>
    )
}

export default Page
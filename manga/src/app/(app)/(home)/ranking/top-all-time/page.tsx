"use client"

import { Button } from "@/components/ui/button"
import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"

import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"



const Page = () => {
    const trpc = useTRPC()
   
    const {data: manga, isLoading} = useQuery(trpc.magas.getRankYear.queryOptions({
        page: 1
    }))
    const { data: category } = useQuery(
    trpc.category.getSubMany.queryOptions()
  );
    if (isLoading || !manga || !category) {
      return <div>Loading...</div>;
    }
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
"use client"

import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"



const Page = () => {
    const trpc = useTRPC()
    const {data: getFollow} = useSuspenseQuery(trpc.magas.getFollowedMangas.queryOptions({page: 1}))
    const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
  );
   
    return (
        <div className="bg-popular">
            <NewUpdate mangas={getFollow?.docs as Mangas[]} category={category} page={getFollow?.page || 1} totalPages={getFollow?.totalPages || 1} />
        </div>
    )
}

export default Page                 
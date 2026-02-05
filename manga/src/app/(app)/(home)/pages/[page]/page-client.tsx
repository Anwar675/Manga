"use client"

import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"


export const PageClient = ({page}: {page:number}) => {
    const trpc = useTRPC()
    
    const {data: manga} = useSuspenseQuery(trpc.magas.getManga.queryOptions({page}))
    const { data: category } = useSuspenseQuery(
    trpc.category.getSubMany.queryOptions()
  );
    return (
        <div>
            <NewUpdate mangas={manga.docs as Mangas[]} category={category} page={manga.page} totalPages={manga.totalPages} />
        </div>
    )
}
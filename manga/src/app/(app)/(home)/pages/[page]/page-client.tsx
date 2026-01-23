"use client"

import { NewUpdate } from "@/modules/home/ui/newUpdate"
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
            <NewUpdate mangas={manga.docs} category={category} page={manga.page} totalPages={manga.totalPages} />
        </div>
    )
}
"use client"

import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"



const Page = () => {
    const trpc = useTRPC()
    const {data: getFollow, isLoading} = useQuery(trpc.magas.getFollowedMangas.queryOptions({page: 1}))
    const { data: category } = useQuery(
    trpc.category.getSubMany.queryOptions()
  );
   
    if (isLoading || !getFollow || !category) {
      return <div>Loading...</div>;
    }
        <div className="bg-popular">
            <NewUpdate mangas={getFollow?.docs as Mangas[]} category={category} page={getFollow?.page || 1} totalPages={getFollow?.totalPages || 1} />
        </div>
    
}

export default Page                 
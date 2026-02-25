"use client"

import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Mangas } from "@/payload-types"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"



const Page = () => {
    const trpc = useTRPC()
    const {data: session} = useQuery(trpc.auth.session.queryOptions())
    const {data: getFollow, isLoading} = useQuery(trpc.magas.getFollowedMangas.queryOptions({page: 1}, {
      enabled:!!session?.user
    }))
    const { data: category } = useQuery(
    trpc.category.getSubMany.queryOptions()
  );
   
    if (isLoading || !getFollow || !category) {
      return <div className="w-full text-center py-12 font-bold bg-popular">
        VUI LÒNG ĐĂNG NHẬP ĐỂ XEM THEO DÕI
      </div>;
    }
        <div className="bg-popular">
            <NewUpdate mangas={getFollow?.docs as Mangas[]} category={category} page={getFollow?.page || 1} totalPages={getFollow?.totalPages || 1} />
        </div>
    
}

export default Page                 
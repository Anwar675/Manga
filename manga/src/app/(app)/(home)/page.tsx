'use client'
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"


export default function Page() {
   const trpc = useTRPC()
   const category = useQuery(trpc.auth.session.queryOptions())
    return (
        <div>
            
            {JSON.stringify(category.data?.user, null,2)}
        </div>
    )
}
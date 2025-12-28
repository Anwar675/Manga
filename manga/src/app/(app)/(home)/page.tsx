'use client'
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"


export default function Page() {
   const trpc = useTRPC()
   const category = useQuery(trpc.category.getMany.queryOptions())
    return (
        <div>
            <p>is Loading: {`${category.isLoading}`}</p>
            {JSON.stringify(category, null,2)}
        </div>
    )
}
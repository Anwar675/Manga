"use client"
import { AdminChat } from "@/modules/comments/ui/admin-chat"
import { BackgroundSlider } from "@/modules/home/background-slide"
import { NewUpdate } from "@/modules/home/ui/newUpdate"
import { Popular } from "@/modules/home/ui/popular"
import { useTRPC } from "@/trpc/client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"



export default function HomeClient() {
    const trpc = useTRPC()
   const { data:category } = useSuspenseQuery(trpc.category.getSubMany.queryOptions());
   console.log(category)
    return (
        <div className="relative bg-popular text-text-popular">
            <BackgroundSlider  />
            <Popular />
            <NewUpdate category={category} />
            <AdminChat />
        </div>
    )
}
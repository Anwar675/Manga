"use client"
import { BackgroundSlider } from "@/modules/home/background-slide"
import { Popular } from "@/modules/home/ui/popular"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"


export default function HomeClient() {
   const trpc = useTRPC()
   const category = useQuery(trpc.auth.session.queryOptions())
    return (
        <div className="relative">
            <BackgroundSlider  />
            <Popular />
        </div>
    )
}
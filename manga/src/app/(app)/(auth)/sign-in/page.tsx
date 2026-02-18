export const dynamic = "force-dynamic"; 
import { SignInView } from "@/modules/auth/ui/signIn-view"
import { caller } from "@/trpc/server"
import { redirect } from "next/navigation"


const Page = async () => {
    const session = await caller.auth.session()
    if(session.user) {
        redirect("/")
    }
    return <div>
        <SignInView />
    </div>
}

export default Page
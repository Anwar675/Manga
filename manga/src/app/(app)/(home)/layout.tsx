
import { getPayload } from "payload"
import configPromise from '@payload-config'

import { Header } from "./header";
import { Category } from "@/payload-types";
import { Navbar } from "@/modules/navabr/navbar";

interface Props {
    children: React.ReactNode;
}

const Layout = async ({children}: Props) => {
    const payload = await getPayload({
            config: configPromise
        })
        const data = await payload.find({
            collection: "categories",
            depth: 1,
            pagination: false,
            where: {
                parent: {
                    exists: false
                }
            }
        })

    const formatData = data.docs.map((doc) => (
        {
            ...doc,
            subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                ...(doc as Category)
            }))
        }
    ))
    return (
        <div className="relative">           
            <Navbar data={formatData} />
            <Header  />
            {children}
        </div>
    )
}
export default Layout;  
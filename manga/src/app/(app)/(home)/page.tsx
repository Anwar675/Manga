import { getPayload } from "payload"
import configPromise from '@payload-config'

export default async function Page() {
    const payload = await getPayload({
        config: configPromise
    })
    const data = await payload.find({
        collection: "users"
    })
    return (
        <div>
            {JSON.stringify(data, null,2)}
        </div>
    )
}
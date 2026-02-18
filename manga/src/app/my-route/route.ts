export const runtime = "nodejs";

import configPromise from '@payload-config'
const { getPayload } = await import("payload");


export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'users',
    limit: 10,
  })
  return Response.json(data)
}

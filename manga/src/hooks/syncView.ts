import { redis } from "@/lib/redis";
import { getPayload } from "payload";
import config from "@/payload.config";

async function syncViews() {
  const payload = await getPayload({ config });

  const views = await redis.hgetall("manga:views");
  if (!views) {
  console.log("No views to sync");
  return;
}

  for (const [id, count] of Object.entries(views)) {
    const increment = Number(count);
    if (increment <= 0) continue;

    const manga = await payload.findByID({
      collection: "mangas",
      id,
    });

    if (!manga) continue;

    await payload.update({
      collection: "mangas",
      id,
      data: {
        views: (manga.views ?? 0) + increment,
      },
    });
  }

  await redis.del("manga:views");

  console.log("✅ synced");
}

syncViews().then(() => process.exit());

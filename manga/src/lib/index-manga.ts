import { getPayload } from "payload";
import config from "../payload.config";
import { meili } from "./meili";


async function run() {

  const payload = await getPayload({ config });

  const mangas = await payload.find({
    collection: "mangas",
    limit: 10000,
  });

  await meili.index("mangas").addDocuments(
    mangas.docs.map((m: any) => ({
      id: m.id,
      title: m.title,
      views: m.views ?? 0,
      rating: m.rating?.avg ?? 0,
    }))
  );

  console.log("Indexed mangas");
}

run();
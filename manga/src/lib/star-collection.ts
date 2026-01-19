import type { CollectionAfterChangeHook } from "payload";

export const updateMangaRating: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {

  if (operation !== "create" && operation !== "update") return;


  setImmediate(async () => {
    try {
      const ratings = await req.payload.find({
        collection: "ratings",
        where: {
          manga: { equals: doc.manga },
        },
        depth: 0,
        pagination: false, // lấy tất cả mà không cần limit cực lớn
      });

      const count = ratings.totalDocs ?? ratings.docs.length;
      const avg =
        ratings.docs.reduce((sum, r) => sum + r.star, 0) / (count || 1);

      await req.payload.update({
        collection: "mangas",
        id: doc.manga,
        depth: 0,
        overrideAccess: true,
        data: {
          rating: {
            avg: Number(avg.toFixed(1)),
            count,
          },
        },
      });
    } catch (err) {
      console.error("❌ updateMangaRating failed:", err);
    }
  });
};

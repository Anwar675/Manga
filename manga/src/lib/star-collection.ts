import type { CollectionAfterChangeHook } from "payload";

export const updateMangaRating: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return;

  if (!doc?.manga) return;

  const mangaId = typeof doc.manga === "string" ? doc.manga : doc.manga.id;

  // Chạy async trong background để không block việc save rating
  setImmediate(async () => {
    try {
      const ratings = await req.payload.find({
        collection: "ratings",
        where: {
          manga: { equals: mangaId },
        },
        pagination: false,
        depth: 0,
      });

      const count = ratings.docs.length;
      const sum = ratings.docs.reduce((s, r) => s + r.star, 0);
      const avgRaw = sum / count;

      // half-star chuẩn
      const avg = Math.round(avgRaw * 2) / 2;

      await req.payload.update({
        collection: "mangas",
        id: mangaId,
        overrideAccess: true,
        data: {
          rating: {
            avg,
            count,
          },
        },
      });
    } catch (err) {
      console.error("❌ updateMangaRating failed:", err);
    }
  });
};

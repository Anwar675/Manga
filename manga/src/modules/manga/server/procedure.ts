import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";
import { redis } from "@/lib/redis";
import {
  getDayKey,
  getYearKey,
  getWeekKey,
  getMonthKey,
} from "@/lib/formatime";

async function getRankFromRedisPaginated(
  ctx: any,
  key: string,
  page: number,
  limit: number = 10,
) {
  const total = await redis.zcard(key);

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const ids = await redis.zrevrange(key, start, end);

  if (ids.length === 0) {
    const fallback = await ctx.payload.find({
      collection: "mangas",
      sort: "-views",
      limit,
      page,
    });

    return {
      docs: fallback.docs,
      totalPages: fallback.totalPages,
      page: fallback.page,
    };
  }

  const mangas = await ctx.payload.find({
    collection: "mangas",
    where: {
      id: { in: ids },
    },
    limit,
  });

  const map = new Map(mangas.docs.map((m: any) => [m.id, m]));

  const ordered = ids.map((id) => map.get(id)).filter(Boolean);

  return {
    docs: ordered,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export const mangasRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "mangas",
      depth: 1,
      limit: 8,
      sort: "-latestChapter.updatedAt",
    });
    return data.docs;
  }),

  ratingManga: protectedProcedure
    .input(
      z.object({
        mangaId: z.string(),
        star: z.number().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const exited = await ctx.payload.find({
        collection: "ratings",
        where: {
          manga: { equals: input.mangaId },
          user: { equals: userId },
        },
        limit: 1,
      });
      if (exited.docs.length > 0) {
        await ctx.payload.update({
          collection: "ratings",
          id: exited.docs[0].id,
          data: { star: input.star },
        });
      } else {
        await ctx.payload.create({
          collection: "ratings",
          data: {
            manga: input.mangaId,
            user: userId,
            star: input.star,
          },
        });
      }
      return { success: true };
    }),

  getManga: baseProcedure
    .input(
      z.object({
        page: z.number().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "mangas",
        depth: 1,
        limit: 28,
        page: input.page,
        sort: "-createdAt",
      });

      return {
        docs: data.docs,
        totalPages: data.totalPages,
        page: data.page,
      };
    }),

  increateView: baseProcedure
    .input(
      z.object({
        mangaid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const manga = await ctx.payload.findByID({
        collection: "mangas",
        id: input.mangaid,
      });
      if (!manga) return;
      await ctx.payload.update({
        collection: "mangas",
        id: input.mangaid,
        data: {
          views: (manga.views ?? 0) + 1,
        },
      });
      await redis.zincrby(getDayKey(), 1, input.mangaid);
      await redis.zincrby(getWeekKey(), 1, input.mangaid);
      await redis.zincrby(getMonthKey(), 1, input.mangaid);
      await redis.zincrby(getYearKey(), 1, input.mangaid);
    }),
  getRankDay: baseProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
    })
  )
  .query(async ({ ctx, input }) => {
    return getRankFromRedisPaginated(
      ctx,
      getDayKey(),
      input.page
    );
  }),
  getRankWeek: baseProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
    })
  )
  .query(async ({ ctx, input }) => {
    return getRankFromRedisPaginated(
      ctx,
      getWeekKey(),
      input.page
    );
  }),
  getRankMonth: baseProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
    })
  )
  .query(async ({ ctx, input }) => {
    return getRankFromRedisPaginated(
      ctx,
      getMonthKey(),
      input.page
    );
  }),
  getRankYear: baseProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
    })
  )
  .query(async ({ ctx, input }) => {
    return getRankFromRedisPaginated(
      ctx,
      getYearKey(),
      input.page
    );
  }),
  followManga: protectedProcedure
    .input(
      z.object({
        mangaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const manga = await ctx.payload.findByID({
        collection: "mangas",
        id: input.mangaId,
      });

      await ctx.payload.create({
        collection: "follows",
        data: {
          user: userId,
          manga: input.mangaId,
        },
      });

      await ctx.payload.update({
        collection: "mangas",
        id: input.mangaId,
        data: {
          followers: (manga.followers ?? 0) + 1,
        },
      });

      return { success: true };
    }),
  unfollowManga: protectedProcedure
    .input(z.object({ mangaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // 1️⃣ tìm follow record
      const existed = await ctx.payload.find({
        collection: "follows",
        where: {
          manga: { equals: input.mangaId },
          user: { equals: userId },
        },
        limit: 1,
      });

      if (existed.docs.length === 0) {
        return { success: true, followed: false };
      }

      await ctx.payload.delete({
        collection: "follows",
        id: existed.docs[0].id,
      });

      const manga = await ctx.payload.findByID({
        collection: "mangas",
        id: input.mangaId,
      });

      await ctx.payload.update({
        collection: "mangas",
        id: input.mangaId,
        data: {
          followers: Math.max(0, (manga.followers ?? 0) - 1),
        },
      });

      return { success: true, followed: false };
    }),

  getRank: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "mangas",
      sort: "-views",
      limit: 10,
    });
    return data.docs;
  }),
  search: baseProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.query.trim()) return [];

      const data = await ctx.payload.find({
        collection: "mangas",
        where: {
          title: {
            like: input.query,
          },
        },
        limit: 5,
      });

      return data.docs;
    }),

  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "mangas",
        depth: 2,
        limit: 1,
        where: {
          slug: {
            equals: input.slug,
          },
        },
      });

      return data.docs[0] ?? null;
    }),
  getFollowStatus: protectedProcedure
    .input(z.object({ mangaId: z.string() }))
    .query(async ({ ctx, input }) => {
      const existed = await ctx.payload.find({
        collection: "follows",
        where: {
          manga: { equals: input.mangaId },
          user: { equals: ctx.session.user.id },
        },
        limit: 1,
      });

      return {
        isFollowed: existed.docs.length > 0,
      };
    }),

  getGenner: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // 1. tìm category theo slug
      const category = await ctx.payload.find({
        collection: "categories",
        where: {
          slug: { equals: input.slug },
        },
        limit: 1,
      });

      if (!category.docs[0]) return [];

      const genreId = category.docs[0].id;

      // 2. tìm manga theo id
      const mangas = await ctx.payload.find({
        collection: "mangas",
        depth: 1,
        where: {
          genres: {
            contains: genreId,
          },
        },
        sort: "-createdAt",
      });

      return mangas.docs;
    }),
});

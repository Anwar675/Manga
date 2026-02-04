import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const mangasRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "mangas",
      depth: 1,
      limit: 8,
      sort: "-createdAt",
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

  increateView: protectedProcedure
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
});

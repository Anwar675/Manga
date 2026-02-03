import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
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
      star: z.number().min(1).max(5)
    })
  )
  .mutation(async ({ctx,input}) => {
    const userId = ctx.session.user.id;
    const exited = await ctx.payload.find({
      collection: "ratings",
      where: {
        manga: {equals:input.mangaId},
        user: {equals:userId}
      },
      limit:1
    })
    if(exited.docs.length > 0) {
      await ctx.payload.update({
        collection:"ratings",
        id:exited.docs[0].id,
        data: {star: input.star}
      })
    } else {
      await ctx.payload.create({
        collection: "ratings",
        data: {
          manga:input.mangaId,
          user:userId,
          star: input.star
        }
      })
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
});

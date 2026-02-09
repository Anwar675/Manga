import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const ChapterRouter = createTRPCRouter({
  getMany: baseProcedure
  .input(z.object({
    mangaId: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.payload.find({
      collection: "chapters",
      depth: 1,
      sort: "-createdAt",
      where: {
        manga: {
          equals: input.mangaId,
        },
      },
    });
    return data.docs;
  }),

  getOne: baseProcedure
  .input(z.object({
    slug: z.string(),
  }))
  .query(async({ctx,input}) => {
    const data = await ctx.payload.find({
      collection: "chapters",
      depth: 1,
      where: {
        slug: {
          equals: input.slug,
        },
      },
    });
    return data.docs[0];
  })

});

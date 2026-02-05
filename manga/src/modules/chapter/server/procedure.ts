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
});

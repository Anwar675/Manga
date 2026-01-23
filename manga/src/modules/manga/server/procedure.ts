import { baseProcedure, createTRPCRouter } from "@/trpc/init";
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
});

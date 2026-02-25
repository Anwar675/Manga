import { Mangas } from "@/payload-types";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const historyRouter = createTRPCRouter({
  saveHistory: protectedProcedure
    .input(
      z.object({
        mangaId: z.string(),
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { mangaId, chapterId } = input;
      const userId = ctx.session.user.id;

      const exist = await ctx.payload.find({
        collection: "history",
        where: {
          and: [{ user: { equals: userId } }, { manga: { equals: mangaId } }],
        },
        limit: 1,
      });

      if (exist.docs.length > 0) {
        return await ctx.payload.update({
          collection: "history",
          id: exist.docs[0].id,
          draft: false,
          data: {
            chapter: chapterId,
          },
        });
      }

      return await ctx.payload.create({
        collection: "history",
        draft: false,
        data: {
          user: userId,
          manga: mangaId,
          chapter: chapterId,
        },
      });
    }),
  getHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const follows = await ctx.payload.find({
        collection: "history",
        where: {
          user: { equals: ctx.session.user.id },
        },
        depth: 2,
        page: input.page,
        limit: 28,
      });

      return {
        docs: follows.docs
          .map((f) => f.manga)
          .filter((m): m is Mangas => typeof m !== "string"),

        page: follows.page,
        totalPages: follows.totalPages,
      };
    }),
});

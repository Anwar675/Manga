import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const commentRouter = createTRPCRouter({
  // Lấy comment
  getMany: baseProcedure.query(async ({ ctx }) => {
    return ctx.payload.find({
      collection: "comments",
      depth: 2,
      sort: "-createdAt",
    });  
  }),

  generMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        effectComment: z.string(),
        parent: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const effect = await ctx.payload.find({
        collection: "effect-comments",
        where: {
          effect: {
            equals: input.effectComment,
          },
        },
        limit: 1,
      });

      if (!effect.docs[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Effect comment not found",
        });
      }
      const user = ctx.session!.user;
   
      const comment = ctx.payload.create({
        collection: "comments",
        data: {
          content: input.content,
          effectComment: effect.docs[0].id,
          parent: input.parent,
          user: user.id,
        },
      });

      return comment;
    }),
});

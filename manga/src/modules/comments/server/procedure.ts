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
      where: {
        type: {
          in: ["admin", "translator", "superadmin"],
        },
      },
      depth: 2,
      sort: "-createdAt",
    });
  }),

  getUserMessage: baseProcedure
  .input(
    z.object({
      mangaId: z.string(),
      page: z.number().min(1),
    }),
  )
  .query(async ({ ctx, input }) => {
    const comments = await ctx.payload.find({
      collection: "comments",
      where: {
        and: [
          { "target.relationTo": { equals: "mangas" } },
          { "target.value": { equals: input.mangaId } },
          { parent: { exists: false } }, // chỉ comment gốc
        ],
      },
      depth: 2,
      sort: "-createdAt",
      page: input.page,
      limit: 10,
    });

    const withReplyCount = await Promise.all(
      comments.docs.map(async (comment) => {
        const count = await ctx.payload.count({
          collection: "comments",
          where: {
            parent: { equals: comment.id },
          },
        });

        return {
          ...comment,
          replyCount: count.totalDocs,
        };
      }),
    );

    return {
      ...comments,
      docs: withReplyCount,
    };
  }),

  getReplies: baseProcedure
    .input(z.object({ parentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.payload.find({
        collection: "comments",
        where: {
          parent: { equals: input.parentId },
        },
        depth: 2,
        sort: "createdAt",
      });
    }),

  adminMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        effectComment: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session!.user;

      // ✅ check role
      if (!["admin", "translator", "superadmin"].includes(user.role)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to post admin messages",
        });
      }

      const effect = await ctx.payload.find({
        collection: "effect-comments",
        where: {
          effect: { equals: input.effectComment },
        },
        limit: 1,
      });

      if (!effect.docs[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Effect comment not found",
        });
      }

      return ctx.payload.create({
        collection: "comments",
        data: {
          content: input.content,
          effectComment: effect.docs[0].id,
          user: user.id,
          type: user.role,
          isOfficial: true,
        },
      });
    }),
  

  UserMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(500),
        effectComment: z.string(),
        mangaId: z.string(),
        parentId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session!.user;

      const effect = await ctx.payload.find({
        collection: "effect-comments",
        where: {
          effect: { equals: input.effectComment },
        },
        limit: 1,
      });

      if (!effect.docs[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Effect comment not found",
        });
      }

      return ctx.payload.create({
        collection: "comments",
        data: {
          content: input.content,
          effectComment: effect.docs[0].id,
          user: user.id,
          target: {
            relationTo: "mangas",
            value: input.mangaId,
          },
          parent: input.parentId || undefined,
          type: "user",
          isOfficial: false,
        },
      });
    }),
});

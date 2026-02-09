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
        targetId: z.string(),
        targetType: z.enum(["mangas", "chapters"]),
        page: z.number().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.payload.find({
        collection: "comments",
        where: {
          and: [
            { "target.relationTo": { equals: input.targetType } },
            { "target.value": { equals: input.targetId } },
            { parent: { exists: false } },
          ],
        },
        depth: 2,
        sort: "-createdAt",
        page: input.page,
        limit: 10,
      });

      const parentIds = comments.docs.map((c) => c.id);

      const replies = await ctx.payload.find({
        collection: "comments",
        where: {
          parent: { in: parentIds },
        },
        limit: 1000,
      });

      const replyMap = replies.docs.reduce(
        (acc, r) => {
          const pid = typeof r.parent === "string" ? r.parent : r.parent?.id;

          if (pid) acc[pid] = (acc[pid] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        ...comments,
        docs: comments.docs.map((c) => ({
          ...c,
          replyCount: replyMap[c.id] || 0,
        })),
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
        targetId: z.string(),
        targetType: z.enum(["mangas", "chapters"]),
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
            relationTo: input.targetType,
            value: input.targetId,
          },
          parent: input.parentId || undefined,
          type: "user",
          isOfficial: false,
        },
      });
    }),
});

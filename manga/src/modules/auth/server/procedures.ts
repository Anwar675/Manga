import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";

import { AUTH_COOKIE } from "../constant";
import { loginSchema, registerSchema } from "../registerSchema";
import z from "zod";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  uploadAvatar: protectedProcedure
    .input(z.custom<File>())
    .mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(await input.arrayBuffer());

      const media = await ctx.payload.create({
        collection: "media",
        data: {
          alt: input.name,
        },
        file: {
          data: buffer,
          mimetype: input.type,
          name: input.name,
          size: buffer.length,
        },
        draft: false,
      });

      await ctx.payload.update({
        collection: "users",
        id: ctx.session.user.id,
        data: {
          avatar: media.id,
        },
      });

      return media;
    }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();

    cookies.set({
      name: AUTH_COOKIE,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // 👈 xóa cookie
    });

    return { success: true };
  }),
  updateProfile: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.payload.update({
      collection: "users",
      id: ctx.session.user.id,
      data: {
        username: input.name,
      }
    });

    return user;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          username: input.username,
          password: input.password,
          // avatar: input.avatar,
          role: "user",
        },
        draft: false,
      });
    }),
  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });
    if (!data.token) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "fail to login" });
    }
    const cookies = await getCookies();
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
    });
    return data;
  }),
});

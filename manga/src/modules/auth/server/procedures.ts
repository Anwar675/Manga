import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
 
import z from "zod";
import { AUTH_COOKIE } from "../constant";
import { registerSchema } from "../registerSchema";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    const session = await ctx.payload.auth({ headers });
    return session;
  }),
  logout:baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
  }),
  register: baseProcedure
    .input(
      registerSchema
    )
    .mutation(async ({input, ctx}) => {
        await ctx.payload.create({
            collection: "users",
            data: {
                email:input.email,
                username: input.username,
                password: input.password
            }
        })
    }),
    login: baseProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string(),
        
      })
    )
    .mutation(async ({input, ctx}) => {
        const data = await ctx.payload.login({
            collection: 'users',
            data: {
                email:input.email,
                password: input.password
            }
        })
        if(!data.token) {
            throw new TRPCError({code: "UNAUTHORIZED", message: "fail to login"})
        }
        const cookies = await getCookies();
        cookies.set({
            name: AUTH_COOKIE,
            value: data.token,
            httpOnly:true,
            path:"/",
            
        })
        return data
    }),
});

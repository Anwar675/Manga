import { baseProcedure, createTRPCRouter } from "@/trpc/init";
export const commentRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ctx}) => {  
    const data = await ctx.payload.find({
        collection: "comments",

    })

    return data
  }),
});

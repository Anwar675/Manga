import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const mangasRouter = createTRPCRouter({
     getMany: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.payload.find({
          collection: "mangas",
          depth:1
        });
        return data.docs
        
      }),
})
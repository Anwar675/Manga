
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
export const bannerRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ctx}) => {
    
    const dataSlide = await ctx.payload.find({
    collection: "banners",
    pagination: false,
    where: {
        active: {
        equals: true,
        },
    },
  sort: "order",

  })

  const slides = dataSlide.docs.map((banner) => (
    {
        id: banner.id,
        title: banner.title,
        link: banner.link,
        image: banner.image
    }
  ))
    return slides
  }),
});

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { Category } from "@/payload-types";

export const categoryRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
      collection: "categories",
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "order",
    });
    const formatData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category),
      })),
    }));
    return formatData;
  }),
  getSubMany: baseProcedure.query(async ({ ctx }) => {
    const genreParent = await ctx.payload.find({
      collection: "categories",
      where: {
        slug: {
          equals: "genres",
        },
      },
      limit: 1,
    });

    const subCategories = await ctx.payload.find({
      collection: "categories",
      where: {
        parent: {
          equals: genreParent.docs[0].id,
        },
      },
      sort: "order",
      pagination: false,
    });
    return subCategories.docs;
  }),
});

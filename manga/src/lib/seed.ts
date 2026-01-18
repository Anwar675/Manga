

type CategoryType = "menu" | "genre" | "ranking" | "other";

type SeedSubCategory = {
  name: string;
  slug: string;
  type?: CategoryType;
};

type SeedCategory = {
  name: string;
  slug: string;
  type: CategoryType;
  order?: number;
  subCategories?: SeedSubCategory[];
};


const categories: SeedCategory[] = [
  {
    name: "Trang chủ",
    slug: "home",
    type: "menu",
    order: 0,
  },
  {
    name: "Thể loại",
    slug: "genres",
    type: "menu",
    order: 1,
    subCategories: [
      { name: "Hành động", slug: "action" },
      { name: "Phiêu lưu", slug: "adventure" },
      { name: "Hài hước", slug: "comedy" },
      { name: "Drama", slug: "drama" },
      { name: "Fantasy", slug: "fantasy" },
      { name: "Kinh dị", slug: "horror" },
      { name: "Tâm lý", slug: "psychological" },
      { name: "Lãng mạn", slug: "romance" },
      { name: "Khoa học viễn tưởng", slug: "sci-fi" },
      { name: "Đời thường", slug: "slice-of-life" },
      { name: "Siêu nhiên", slug: "supernatural" },
      { name: "Trinh thám", slug: "mystery" },
      { name: "Võ thuật", slug: "martial-arts" },
      { name: "Học đường", slug: "school-life" },
      { name: "Thể thao", slug: "sports" },
      { name: "Mecha", slug: "mecha" },
      { name: "Ecchi", slug: "ecchi" },
      { name: "Harem", slug: "harem" },
      { name: "Isekai", slug: "isekai" },
      { name: "Seinen", slug: "seinen" },
      { name: "Shounen", slug: "shounen" },
      { name: "Shoujo", slug: "shoujo" },
      { name: "Josei", slug: "josei" },
    ],
  },
  {
    name: "FanPage",
    slug: "facebook",
    type: "menu",
    order: 3,
  },
  {
    name: "Xếp hạng",
    slug: "ranking",
    type: "menu",
    order: 4,
    subCategories: [
      { name: "Top ngày", slug: "top-daily", type: "ranking" },
      { name: "Top tuần", slug: "top-weekly", type: "ranking" },
      { name: "Top tháng", slug: "top-monthly", type: "ranking" },
      { name: "Top mọi thời đại", slug: "top-all-time", type: "ranking" },
    ],
  },
  {
    name: "Khác",
    slug: "others",
    type: "menu",
    order: 5,
    subCategories: [
      { name: "Truyện mới", slug: "new-release", type: "other" },
      { name: "Mới cập nhật", slug: "recent-updated", type: "other" },
      { name: "Truyện hot", slug: "trending", type: "other" },
      { name: "Được yêu thích", slug: "most-favorite", type: "other" },
      { name: "Xem nhiều", slug: "most-viewed", type: "other" },
      { name: "Đánh giá cao", slug: "top-rated", type: "other" },
      { name: "Truyện ngẫu nhiên", slug: "random", type: "other" },
    ],
  },
];

import config from "@payload-config";

import { getPayload } from "payload";


const seed = async () => {
  const payload = await getPayload({ config });

  for (const category of categories) {
  
    const existingParent = await payload.find({
      collection: "categories",
      where: {
        slug: { equals: category.slug },
      },
      limit: 1,
    });

    const parent =
      existingParent.docs[0] ??
      (await payload.create({
        collection: "categories",
        data: {
          name: category.name,
          slug: category.slug,
          type: category.type,
          parent: null,
          order: category.order ?? 0,
        },
      }));

    
    for (const [index, sub] of (category.subCategories ?? []).entries()) {
      const existingSub = await payload.find({
        collection: "categories",
        where: {
          slug: { equals: sub.slug },
        },
        limit: 1,
      });

      if (!existingSub.docs.length) {
        await payload.create({
          collection: "categories",
          data: {
            name: sub.name,
            slug: sub.slug,
            type: sub.type ?? "genre",
            parent: parent.id,
            order: index,
          },
        });
      }
    }
  }

  
};

await seed();
process.exit(0);



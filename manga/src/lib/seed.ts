import { getPayload } from "payload";
import config from "@payload-config"
const categories = [
  {
    name: "Trang chủ",
    slug: "home",
    order: 0
  },
  {
    name: "Thể loại", 
    slug: "genres",
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
    order: 1
  },
  {
    name: "Lịch sử",
    slug: "history",
    order: 3
  },
  {
    name: "Xếp hạng",
    slug: "ranking",
    subCategories: [
      { name: "Top ngày", slug: "top-daily" },
      { name: "Top tuần", slug: "top-weekly" },
      { name: "Top tháng", slug: "top-monthly" },
      { name: "Top mọi thời đại", slug: "top-all-time" },
    ],
    order: 4
  },
  {
  name: "Khác",
  slug: "others",
  subCategories: [
    { name: "Truyện mới", slug: "new-release" },
    { name: "Mới cập nhật", slug: "recent-updated" },
    { name: "Truyện hot", slug: "trending" },
    { name: "Được yêu thích", slug: "most-favorite" },
    { name: "Xem nhiều", slug: "most-viewed" },
    { name: "Đánh giá cao", slug: "top-rated" },
    { name: "Truyện ngẫu nhiên", slug: "random" },
  ],
  order: 5
}

];

const seed = async () => {
  const payload = await getPayload({config})
  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        parent: null,
        order: category.order,
      }
    })
    for(const subCategory of category.subCategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: subCategory.slug,
          parent: parentCategory.id,
          order: category.order,
        }
      })
    }
  }
}

await seed()
process.exit(0)
import type { CollectionConfig } from "payload";

export const Chapters: CollectionConfig = {
  slug: "chapters",

  admin: {
    useAsTitle: "title",
    // defaultColumns: ["title", "manga", "chapterNumber", "status", "createdAt"],
  },

  fields: [
    // 🔗 CHAPTER THUỘC TRUYỆN NÀO
    {
      name: "manga",
      type: "relationship",
      relationTo: "mangas",
      required: true,
      index: true,
    },

    // 🧾 TIÊU ĐỀ CHAPTER
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        placeholder: "Chapter 1: Khởi đầu",
      },
    },

    // 🔢 SỐ CHAPTER
    {
      name: "chapterNumber",
      type: "number",
      required: true,
      index: true,
    },

    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
      },
    },

   
    {
      name: "pages",
      type: "array",
      required: true,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },


    {
      name: "views",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },

  
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Nháp", value: "draft" },
        { label: "Đã xuất bản", value: "published" },
      ],
    },

    // 👤 NGƯỜI ĐĂNG
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },


    {
      name: "publishedAt",
      type: "date",
      admin: {
        condition: (_, siblingData) =>
          siblingData?.status === "published",
      },
    },
  ],

//   hooks: {
//     // 🧠 TỰ GÁN NGƯỜI ĐĂNG
//     beforeChange: [
//       ({ req, data }) => {
//         if (req.user) {
//           data.createdBy = req.user.id;
//         }
//         return data;
//       },
//     ],

//     // 🔁 UPDATE LATEST CHAPTER CHO MANGA
//     afterChange: [
//       async ({ doc, req }) => {
//         const payload = req.payload;

//         await payload.update({
//           collection: "mangas",
//           id: doc.manga,
//           data: {
//             latestChapter: {
//               slug: doc.slug,
//               updatedAt: doc.updatedAt,
//             },
//           },
//         });
//       },
//     ],
//   },
};

import { CollectionConfig } from "payload";

export const AdminComment: CollectionConfig = {
  slug: "admin-comments",
  admin: {
    defaultColumns: ["content", "user", "announcement", "createdAt"],
  },
//   access: {
//     create: ({ req }) => !!req.user,
//     read: () => true,
//     update: ({ req }) => req.user?.role === "admin",
//     delete: ({ req }) => req.user?.role === "admin",
//   },
  fields: [
    {
      name: "EffectComment",
      type: "relationship",
      relationTo: "effect-comments",
      required: true,
      index: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "content",
      type: "text",
      required: true,
      maxLength: 500,
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "admin-comments",
      index: true,
    },
    {
      name: "isOfficial",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Comment từ admin / team dịch",
      },
    },
  ],
};

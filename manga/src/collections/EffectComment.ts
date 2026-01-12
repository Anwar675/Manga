import { CollectionConfig } from "payload";

export const EffecComment: CollectionConfig = {
  slug: "effect-comments",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "isPinned", "createdAt"],
  },
//   access: {
//     create: ({ req }) =>
//       ["admin", "translator"].includes(req.user?.role),
//     update: ({ req }) =>
//       ["admin", "translator"].includes(req.user?.role),
//     delete: ({ req }) => req.user?.role === "admin",
//     read: () => true,
//   },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "images",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "tag",
      type: "select",
      options: [
        { label: "🔥 Quan trọng", value: "important" },
        { label: "📢 Thông báo", value: "normal" },
        { label: "🎉 Ra chapter", value: "release" },
      ],
      defaultValue: "normal",
      index: true,
    },
    {
      name: "effect",
      type: "select",
      options: [
        { label: "Không", value: "none" },
        { label: "Glow", value: "glow" },
        { label: "Confetti", value: "confetti" },
      ],
      defaultValue: "none",
    },
    {
      name: "isPinned",
      type: "checkbox",
      defaultValue: false,
    //   access: {
    //     update: ({ req }) => req.user?.role === "admin",
    //   },
      index: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
};

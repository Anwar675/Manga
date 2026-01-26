import { CollectionConfig } from "payload";

export const Comments: CollectionConfig = {
  slug: "comments",

  admin: {
    defaultColumns: ["content", "user", "effectComment", "isOfficial", "createdAt"],
  },

  fields: [
    {
      name: "effectComment",
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
      type: "textarea",
      required: true,
      maxLength: 500,
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "comments",
      index: true,
    },
    {
      name: "isOfficial",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Admin / team dịch",
      },
    },
  ],
};

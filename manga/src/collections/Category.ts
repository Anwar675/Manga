import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",

  admin: {
    useAsTitle: "name",
  },
  access: {
    create: ({req: {user} }) => !!user && ["admin", "superadmin"].includes(user.role),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },

    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },

    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Menu", value: "menu" },
        { label: "Genre", value: "genre" },
        { label: "Ranking", value: "ranking" },
        { label: "Other", value: "other" },
      ],
    },

    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
    },

    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
      defaultLimit: 100,
    },

    {
      name: "order",
      type: "number",
      defaultValue: 0,
      index: true,
    },
  ],
};

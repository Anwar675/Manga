import { CollectionConfig } from "payload";
import slugify from "slugify";
export const Manga: CollectionConfig = {
  slug: "mangas",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (!siblingData?.title) return;
            return slugify(siblingData.title, {
              lower: true,
              strict: true,
            });
          },
        ],
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "genres",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      required: true,
      filterOptions: () => ({
        type: { equals: "genre" },
      }),
    },
    {
      name: "rating",
      type: "group",
      fields: [
        {
          name: "avg",
          type: "number",
          defaultValue: 0,
        },
        {
          name: "count",
          type: "number",
          defaultValue: 0,
        },
      ],
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    // TO DO: update ảnh riêng theo mỗi admin cũng như translatranslate
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: ["ongoing", "completed", "hiatus"],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
    },

    { name: "views", type: "number", defaultValue: 0 },
    { name: "followers", type: "number", defaultValue: 0 },

    {
      name: "latestChapter",
      type: "group",
      admin: { readOnly: true },
      fields: [
        { name: "number", type: "text" },
        { name: "slug", type: "text" },
        { name: "updatedAt", type: "date" },
      ],
    },
  ],
};

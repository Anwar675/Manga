import type { CollectionConfig } from "payload";

export const MangaViews: CollectionConfig = {
  slug: "manga-views",

  fields: [
    {
      name: "manga",
      type: "relationship",
      relationTo: "mangas",
      required: true,
    },

    {
      name: "date",
      type: "date",
      required: true,
      index: true,
    },

    {
      name: "count",
      type: "number",
      defaultValue: 1,
    },
  ],

  indexes: [
    {
      fields: ["manga", "date"],
      unique: true,
    },
  ],
};

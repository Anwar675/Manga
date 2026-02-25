import { CollectionConfig } from "payload";

export const History: CollectionConfig = {
  slug: "history",

  timestamps: true,

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "manga",
      type: "relationship",
      relationTo: "mangas",
      required: true,
    },
    {
      name: "chapter",
      type: "relationship",
      relationTo: "chapters",
    },
  ],

  indexes: [
    {
      fields: ["user", "manga"],
      unique: true,
    },
  ],
};
import { CollectionConfig } from "payload";

export const Follows: CollectionConfig = {
  slug: "follows",
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
  ],
  indexes: [
    {
      fields: ["user", "manga"],
      unique: true, 
    },
  ],
};

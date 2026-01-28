import { updateMangaRating } from "@/lib/star-collection";
import { CollectionConfig } from "payload";

export const Rating: CollectionConfig = {
  slug: "ratings",
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    {
      name: "manga",
      type: "relationship",
      relationTo: "mangas",
      required: true,
      index: true,
    },
    {
      name: "star",
      type: "number",
      required: true,
      min: 1,
      max: 5
    },

  ],
  indexes: [
    {
      fields: ["manga", "user"],
      unique: true
    }
  ],
  hooks: {
    afterChange: [updateMangaRating],
  },
};

import { updateMangaRating } from "@/lib/star-collection";
import { CollectionConfig } from "payload";

export const Rating: CollectionConfig = {
  slug: "ratings",
   access: {
    read: ({ req: { user } }) => {
      if (!user) return false;

      // superadmin + admin thấy tất cả
      if (user.role === "superadmin" || user.role === "admin") {
        return true;
      }

      // translator chỉ thấy ảnh của mình
      if (user.role === "translator") {
        return {
          uploadedBy: {
            equals: user.id,
          },
        };
      }

      return false;
    },

  },
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

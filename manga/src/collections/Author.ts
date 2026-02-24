import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
   access: {
    read: ({ req: { user } }) => {
      if (!user) return false;  
      if (user.role === "superadmin" || user.role === "admin" || user.role === "translator") {
        return true;
      }
      return false;
    },

    create: ({ req: { user } }) =>
      !!user && ["translator", "admin", "superadmin"].includes(user.role),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};

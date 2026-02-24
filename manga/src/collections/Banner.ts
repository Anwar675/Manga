import type { CollectionConfig } from "payload";

export const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title",
  },
   access: {
    read: ({ req: { user } }) => {
      if (!user) return false;

     
      if (user.role === "superadmin" || user.role === "admin" || user.role == "translator") {
        return true;
      }

      return false;
    },

    create: ({ req: { user } }) =>
      !!user && ["translator", "admin", "superadmin"].includes(user.role),
  },
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "link",
      type: "text",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

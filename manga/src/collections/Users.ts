import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "username",
  },
  auth: true,
   access: {
    read: ({ req: { user } }) =>
      user?.role === "superadmin" || user?.role === "admin",

    update: ({ req: { user } }) =>
      user?.role === "superadmin" || user?.role === "admin",

    delete: ({ req: { user } }) =>
      user?.role === "superadmin",
  },


  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },

    // 🔥 ROLE SYSTEM
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "user",
      options: [
        { label: "User", value: "user" },
        { label: "Translator", value: "translator" },
        { label: "Admin", value: "admin" },
        { label: "Super Admin", value: "superadmin" },
      ],
      access: {
        read: ({ req: { user } }) =>
          user?.role === "admin" || user?.role === "superadmin",

        update: ({ req: { user } }) =>
          user?.role === "superadmin", 
      },

      admin: {
        position: "sidebar",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};

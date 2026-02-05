import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "username",
  },
  auth: true,

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
      admin: {
        position: "sidebar",
      },
    },
  ],
};

import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
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

    create: ({ req: { user } }) =>
      !!user && ["translator", "admin", "superadmin"].includes(user.role),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
  },
};

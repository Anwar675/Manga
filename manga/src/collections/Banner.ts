import type { CollectionConfig } from "payload";

export const Banners: CollectionConfig = {
  slug: "banners",
  admin: {
    useAsTitle: "title",
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

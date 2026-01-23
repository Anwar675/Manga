import { CollectionConfig } from "payload";

export const EffectComment: CollectionConfig = {
  slug: "effect-comments",

  admin: {   
    defaultColumns: [ "tag", "effect", "isPinned", "createdAt"],
  },

  fields: [
    
    
    // 🏷 Tag: frontend quyết định màu / icon
    {
      name: "tag",
      type: "select",
      options: [
        { label: "🔥 Quan trọng", value: "important" },
        { label: "📢 Thông báo", value: "normal" },
        { label: "🎉 Ra chapter", value: "release" },
      ],
      defaultValue: "normal",
      index: true,
    },

    // ✨ Effect: frontend tự map animation
    {
      name: "effect",
      type: "select",
      options: [
        { label: "Không", value: "none" },
        { label: "Glow", value: "glow" },
        { label: "Confetti", value: "confetti" },
      ],
      defaultValue: "none",
    },

    {
      name: "isPinned",
      type: "checkbox",
      defaultValue: false,
      index: true,
    },

    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
};

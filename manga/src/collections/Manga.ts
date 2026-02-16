import { CollectionConfig } from "payload";
import slugify from "slugify";
export const Manga: CollectionConfig = {
  slug: "mangas",
  admin: {
    useAsTitle: "title",
  },
   access: {
    read: ({ req: { user } }) => {
      if (!user) return false;

     
      if (user.role === "superadmin" || user.role === "admin") {
        return true;
      }

      
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
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: { readOnly: true },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (!siblingData?.title) return;
            return slugify(siblingData.title, {
              lower: true,
              strict: true,
            });
          },
        ],
      },
    },
    {
      name: "description",
      label: "Giới thiệu",
      type: "richText",
      required: false,
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "genres",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
      required: true,
      filterOptions: () => ({
        type: { equals: "genre" },
      }),
    },
    {
      name: "rating",
      type: "group",
      fields: [
        {
          name: "avg",
          type: "number",
          defaultValue: 0,
        },
        {
          name: "count",
          type: "number",
          defaultValue: 0,
        },
      ],
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "ageRating",
      label: "Độ tuổi",
      type: "select",
      required: true,
      options: [
        { label: "Mọi lứa tuổi", value: "all" },
        { label: "13+", value: "13+" },
        { label: "16+", value: "16+" },
        { label: "18+", value: "18+" },
      ],
      defaultValue: "13+",
    },

    
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: ["Đang cập nhập", "Đã hoàn thành", "hiatus"],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
          displayFormat: "dd/MM/yyyy HH:mm",
        },
      },
    },

    { name: "views", type: "number", defaultValue: 0 },
    { name: "followers", type: "number", defaultValue: 0 },

    {
      name: "latestChapter",
      type: "group",
      admin: { readOnly: true },
      fields: [
        { name: "number", type: "text" },
        { name: "slug", type: "text" },
        { name: "updatedAt", type: "date" , index: true},
      ],
    },
  ],
};

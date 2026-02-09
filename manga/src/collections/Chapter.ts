import type { CollectionConfig } from "payload";
import slugify from "slugify";

export const Chapters: CollectionConfig = {
  slug: "chapters",

  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "manga", "chapterNumber"],
  },

  fields: [
    {
      name: "manga",
      type: "relationship",
      relationTo: "mangas",
      required: true,
      index: true,
    },

    {
      name: "title",
      type: "text",
      required: true,
    },

    {
      name: "chapterNumber",
      type: "number",
      required: true,
      index: true,
      admin: { step: 0.1 },
    },

    {
      name: "slug",
      type: "text",
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "bulkUpload",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description: "Upload nhiều ảnh để tự tạo pages",
      },
    },
    {
      name: "pages",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "order",
          type: "number",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },

    {
      name: "views",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },

    {
      name: "status",
      type: "select",
      defaultValue: "published",
      admin: { readOnly: true },
      options: [{ label: "Đã xuất bản", value: "published" }],
    },

    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },

    {
      name: "publishedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],

  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data;

        if (operation === "create" && req.user) {
          data.createdBy = req.user.id;
        }
        if (operation === "create" && data.bulkUpload?.length) {
          // fetch media info để lấy filename
          const mediaDocs = await req.payload.find({
            collection: "media",
            where: {
              id: {
                in: data.bulkUpload.map((img: any) =>
                  typeof img === "string" ? img : img.id,
                ),
              },
            },
            limit: 1000,
          });

          // sort theo filename
          const getName = (doc: any): string =>
            doc.filename ?? doc.originalFilename ?? doc.url ?? doc.id ?? "";

          const sorted = mediaDocs.docs.sort((a, b) =>
            getName(a).localeCompare(getName(b), undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );

          data.pages = sorted.map((img, i) => ({
            order: i + 1,
            image: img.id,
          }));

          delete data.bulkUpload;
        }

        // auto tăng chapter nếu chưa nhập
        if (
          operation === "create" &&
          data.manga &&
          data.chapterNumber == null
        ) {
          const mangaId =
            typeof data.manga === "string" ? data.manga : data.manga.id;

          const last = await req.payload.find({
            collection: "chapters",
            where: { manga: { equals: mangaId } },
            sort: "-chapterNumber",
            limit: 1,
            depth: 0,
          });

          data.chapterNumber = last.docs[0]?.chapterNumber
            ? Number(last.docs[0].chapterNumber) + 1
            : 1;
        }

        if (!data.slug && data.manga && data.chapterNumber != null) {
          data.slug = slugify(`chapter-${data.chapterNumber}`, {
            lower: true,
            strict: true,
          });
        }

        data.publishedAt = new Date();
        return data;
      },
    ],

    beforeChange: [
      async ({ data, req, originalDoc, operation }) => {
        if (!data?.manga || data.chapterNumber == null) return data;

        const mangaId =
          typeof data.manga === "string" ? data.manga : data.manga.id;

        const exists = await req.payload.find({
          collection: "chapters",
          where: {
            manga: { equals: mangaId },
            chapterNumber: { equals: data.chapterNumber },
            ...(operation === "update" && originalDoc?.id
              ? { id: { not_equals: originalDoc.id } }
              : {}),
          },
          limit: 1,
          depth: 0,
        });

        if (exists.docs.length) {
          throw new Error(`Chapter ${data.chapterNumber} đã tồn tại`);
        }

        return data;
      },
    ],

    afterChange: [
      async ({ doc, req, operation }) => {
        setImmediate(async () => {
          try {
            if (operation !== "create" && operation !== "update") return;

            if (doc.status !== "published") return;

            const mangaId =
              typeof doc.manga === "string" ? doc.manga : doc.manga?.id;

            if (!mangaId) return;

            // Đảm bảo slug và chapterNumber tồn tại
            if (!doc.slug || doc.chapterNumber == null) {
              console.warn(
                "Chapter slug or chapterNumber is missing, skipping latestChapter update",
              );
              return;
            }

            await req.payload.update({
              collection: "mangas",
              id: mangaId,
              overrideAccess: true,
              depth: 0,
              data: {
                latestChapter: {
                  number: String(doc.chapterNumber),
                  slug: doc.slug,
                  updatedAt: new Date().toISOString(),
                },
              },
            });
          } catch (error) {
            console.error("Error updating latestChapter in manga:", error);
          }
        });
      },
    ],
  },
};

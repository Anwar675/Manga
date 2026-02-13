import "dotenv/config";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "../payload.config";
import mime from "mime-types";

const MANGA_ID = "8f7140d3-66b6-47a2-a043-3508297e38d0";
const ROOT_FOLDER = path.resolve(process.cwd(), "public/img/manga");

async function run() {
  const payload = await getPayload({ config });

  if (!fs.existsSync(ROOT_FOLDER)) {
    throw new Error(`Folder không tồn tại: ${ROOT_FOLDER}`);
  }

  const chapterFolders = fs
    .readdirSync(ROOT_FOLDER)
    .filter((f) => fs.statSync(path.join(ROOT_FOLDER, f)).isDirectory())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  console.log(`📂 Tìm thấy ${chapterFolders.length} chapter`);

  for (const folder of chapterFolders) {
    const chapterNumber = Number(folder);

    if (isNaN(chapterNumber)) {
      console.log(`❌ Bỏ qua folder không hợp lệ: ${folder}`);
      continue;
    }

    const chapterPath = path.join(ROOT_FOLDER, folder);

    // ✅ CHECK chapter tồn tại trước
    const existing = await payload.find({
      collection: "chapters",
      where: {
        and: [
          { manga: { equals: MANGA_ID } },
          { chapterNumber: { equals: chapterNumber } },
        ],
      },
    });

    if (existing.docs.length) {
      console.log(`⚠️ Chapter ${chapterNumber} đã tồn tại → skip`);
      continue;
    }

    console.log(`🚀 Import Chapter ${chapterNumber}...`);

    const files = fs
      .readdirSync(chapterPath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    if (!files.length) {
      console.log(`❌ Chapter ${chapterNumber} không có ảnh`);
      continue;
    }

    // ✅ Upload ảnh song song
    const pages = await Promise.all(
      files.map(async (file, index) => {
        const filePath = path.join(chapterPath, file);
        const buffer = await fs.promises.readFile(filePath);
        const mimeType = mime.lookup(filePath) || "image/jpeg";

        const media = await payload.create({
          collection: "media",
          data: {
            alt: `${folder}-${index + 1}`,
          },
          file: {
            data: buffer,
            mimetype: mimeType,
            name: path.basename(filePath),
            size: buffer.length,
          },
          draft: false,
        });

        return {
          order: index + 1,
          image: media.id,
        };
      })
    );

    // ✅ Tạo chapter
    await payload.create({
      collection: "chapters",
      data: {
        manga: MANGA_ID,
        title: `Chapter ${chapterNumber}`,
        chapterNumber,
        pages,
      },
    });

    console.log(`✅ Done Chapter ${chapterNumber}`);
  }

  console.log("🎉 Import finished");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});

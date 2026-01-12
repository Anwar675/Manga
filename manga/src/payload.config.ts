import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Category";
import { Banners } from "./collections/Banner";
import { Authors } from "./collections/Author";
import { Manga } from "./collections/Manga";
import { Chapters } from "./collections/Chapter";
import { EffecComment } from "./collections/EffectComment";
import { AdminComment } from "./collections/AdminComment";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Banners, Authors, Manga, Chapters, EffecComment, AdminComment],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    idType: "uuid"
  }),
  sharp,
  plugins: [],
});

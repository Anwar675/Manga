import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/modules/auth/constant";

export async function POST(req: NextRequest) {
  try {
    // ✅ INIT payload đúng cách
    const payload = await getPayload({ config });

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = await payload.auth({
      headers: new Headers({
        authorization: `JWT ${token}`,
      }),
    });

    if (!user) {
      return NextResponse.json({ error: "No user" }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const media = await payload.create({
      collection: "media",
      data: { alt: file.name },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: buffer.length,
      },
    });

    await payload.update({
      collection: "users",
      id: user.id,
      data: {
        avatar: media.id,
      },
    });

    return NextResponse.json({
      success: true,
      url: media.url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

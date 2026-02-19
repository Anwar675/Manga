import { cache } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import PageClient from "./pageClient";

import { getImageUrl, richTextToPlainText } from "@/lib/seo";

const SITE_URL = "https://your-domain.com";

export const revalidate = 60;

/* ---------- cached fetch ---------- */

const getMangaCached = cache(async (slug: string) => {
  const qc = getQueryClient();

  return qc.fetchQuery(
    trpc.magas.getOne.queryOptions({
      slug,
    })
  );
});

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;

  const manga = await getMangaCached(slug);

  if (!manga) {
    return {
      title: "Manga không tồn tại",
      description: "Trang truyện không tồn tại",
    };
  }

  const descriptionText = richTextToPlainText(manga.description);
  const imageUrl = getImageUrl(manga.cover);
  const url = `${SITE_URL}/manga/${slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: `${manga.title} | Đọc truyện tranh online`,
    description:
      descriptionText.slice(0, 160) ||
      `Đọc ${manga.title} online miễn phí`,
    alternates: { canonical: url },

    openGraph: {
      title: manga.title,
      description: descriptionText,
      url,
      type: "article",
      locale: "vi_VN",
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: manga.title }]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title: manga.title,
      description: descriptionText,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

/* ---------- page ---------- */

type PageProps = {
  params: Promise<{ manga: string }>;
};

export default async function Page({ params }: PageProps) {
  const { manga: slug } = await params;

  const queryClient = getQueryClient();

  const manga = await getMangaCached(slug);

  await Promise.all([
    queryClient.prefetchQuery(
      trpc.category.getSubMany.queryOptions()
    ),

    manga?.id
      ? queryClient.prefetchQuery(
          trpc.chapter.getMany.queryOptions({
            mangaId: manga.id,
          })
        )
      : Promise.resolve(),
  ]);

  const descriptionText = richTextToPlainText(manga?.description);
  const imageUrl = getImageUrl(manga?.cover);

  const jsonLd =
    manga && {
      "@context": "https://schema.org",
      "@type": "ComicSeries",
      name: manga.title,
      description: descriptionText,
      image: imageUrl,
      url: `${SITE_URL}/manga/${slug}`,
    };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      <PageClient params={{ manga: slug }} />
    </HydrationBoundary>
  );
}

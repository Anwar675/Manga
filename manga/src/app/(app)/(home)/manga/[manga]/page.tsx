import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import PageClient from "./pageClient";
import type { Metadata } from "next";
import { getImageUrl, richTextToPlainText } from "@/lib/seo";

const SITE_URL = "https://your-domain.com";

/* --------------------------
   SEO Metadata
-------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}): Promise<Metadata> {
  const { manga: slug } = await params;

  const queryClient = getQueryClient();

  const manga = await queryClient.fetchQuery(
    trpc.magas.getOne.queryOptions({ slug })
  );

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

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: manga.title,
      description: descriptionText,
      url,
      type: "article",
      locale: "vi_VN",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: manga.title,
            },
          ]
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

/* --------------------------
   Page
-------------------------- */

const Page = async ({
  params,
}: {
  params: Promise<{ manga: string }>;
}) => {
  const { manga: slug } = await params;

  const queryClient = getQueryClient();

  const manga = await queryClient.fetchQuery(
    trpc.magas.getOne.queryOptions({ slug })
  );

  const categoryPromise = queryClient.prefetchQuery(
    trpc.category.getSubMany.queryOptions()
  );

  const chapterPromise = manga?.id
    ? queryClient.prefetchQuery(
        trpc.chapter.getMany.queryOptions({
          mangaId: manga.id,
        })
      )
    : Promise.resolve();

  await Promise.all([categoryPromise, chapterPromise]);

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
      author: {
        "@type": "Person",
        name:
          typeof manga.author === "string"
            ? manga.author
            : manga.author?.name ?? "Unknown",
      },
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
};

export default Page;

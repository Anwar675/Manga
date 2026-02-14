import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import GennerClient from "./gener-client";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ genner: string }>;
};

const SITE_URL = "https://your-domain.com";

const formatSlug = (slug: string) =>
  decodeURIComponent(slug).replace(/-/g, " ");

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { genner } = await params;
  const name = formatSlug(genner);
  const url = `${SITE_URL}/genres/${encodeURIComponent(genner)}`;

  return {
    metadataBase: new URL(SITE_URL),

    title: `Truyện ${name} hay nhất | Đọc manga ${name}`,
    description: `Khám phá danh sách manga thể loại ${name}. Cập nhật truyện mới nhất, đọc miễn phí và nhanh nhất.`,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `Manga thể loại ${name}`,
      description: `Danh sách truyện tranh thể loại ${name}`,
      url,
      type: "website",
      locale: "vi_VN",
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const { genner } = await params;
  const name = formatSlug(genner);

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      trpc.category.getSubMany.queryOptions()
    ),
    queryClient.prefetchQuery(
      trpc.magas.getGenner.queryOptions({
        slug: genner,
      })
    ),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Thể loại ${name}`,
    description: `Danh sách manga thể loại ${name}`,
    url: `${SITE_URL}/genres/${encodeURIComponent(genner)}`,
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GennerClient genner={genner} />
    </HydrationBoundary>
  );
};

export default Page;

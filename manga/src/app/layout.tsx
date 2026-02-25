import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Kanit } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "./providers/theme-provider";

const kanit = Kanit({
  subsets: ["latin", "thai", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
});
export const viewport: Viewport = {
  themeColor: "#0f172a",
};
export const metadata: Metadata = {
  metadataBase: new URL("https://alga21.site"),

  title: {
    default: "Alga – Đọc truyện tranh online",
    template: "%s | Alga",
  },

  description: "Web đọc manga miễn phí, cập nhật nhanh, hỗ trợ dark mode.",

  keywords: ["đọc manga", "truyện tranh online", "manga tiếng việt"],

  

  openGraph: {
    title: "Alga – Đọc truyện tranh online",
    description: "Đọc manga miễn phí, tốc độ cao.",
    url: "https://alga21.site",
    siteName: "Alga",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alga",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Alga – Đọc truyện tranh online",
    description: "Web đọc manga miễn phí.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={kanit.className}>
        <ThemeProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

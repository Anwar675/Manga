import type { Metadata } from "next";

import "./globals.css";
import { Kanit } from "next/font/google"
import {  TRPCReactProvider } from "@/trpc/client";

const kanit = Kanit({
  subsets: ["latin", "thai", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-kanit",
})
  export const metadata: Metadata = {
  title: {
    default: "Alga – Đọc truyện tranh online",
    template: "%s | Alga",
  },
  description:
    "Web đọc manga miễn phí, cập nhật nhanh, hỗ trợ dark mode, đọc mượt trên mọi thiết bị.",

  keywords: [
    "đọc manga",
    "truyện tranh online",
    "manga tiếng việt",
  ],

  openGraph: {
    title: "Alga – Đọc truyện tranh online",
    description:
      "Đọc manga miễn phí, tốc độ cao, giao diện đẹp.",
    url: "https://Alga.vn",
    siteName: "Alga",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alga",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Alga – Đọc truyện tranh online",
    description:
      "Web đọc manga miễn phí, giao diện đẹp.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  }>) {
    return (
      <html lang="en" >
        <body className={kanit.className}>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    );
}

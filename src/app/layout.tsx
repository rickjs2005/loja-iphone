import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInjector } from "@/components/theme/theme-injector";
import { storeConfig } from "@/config/theme.config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// viewport-fit=cover libera as safe areas do iOS (env(safe-area-inset-*)).
export const viewport: Viewport = {
  themeColor: storeConfig.colors.bg,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${storeConfig.name} · iPhones com garantia`,
    template: `%s · ${storeConfig.name}`,
  },
  description: storeConfig.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: storeConfig.name,
    title: storeConfig.name,
    description: storeConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: storeConfig.name,
    description: storeConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeInjector />
      </head>
      <body className="min-h-full bg-bg text-fg flex flex-col">{children}</body>
    </html>
  );
}

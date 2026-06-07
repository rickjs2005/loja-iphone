import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: storeConfig.name,
    template: `%s · ${storeConfig.name}`,
  },
  description: storeConfig.description,
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

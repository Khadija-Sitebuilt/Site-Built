import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SiteBuilt - Construction Documentation Made Simple",
  description: "Upload floor plans, geo-tagged photos, and create professional as-built documentation",
};

import { PHProvider } from "@/components/PostHogProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <PHProvider>
          {children}
        </PHProvider>
      </body>
    </html>
  );
}

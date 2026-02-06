import type { Metadata } from "next";
import {
  Arimo,
  Inter,
  JetBrains_Mono,
  Outfit,
  Plus_Jakarta_Sans,
  Roboto,
} from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const arimo = Arimo({ subsets: ["latin"], variable: "--font-arimo" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "SiteBuilt - Construction Documentation Made Simple",
  description:
    "Upload floor plans, geo-tagged photos, and create professional as-built documentation",
};

import { PHProvider } from "@/components/PostHogProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${outfit.variable} ${arimo.variable} ${jakarta.variable} ${roboto.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}

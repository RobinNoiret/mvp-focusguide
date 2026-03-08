import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});

// BN Recon Grotesk is loaded from /public via @font-face in globals.css
const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Focus Guide",
  description: "Manage your tasks and boost productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${primaryFont.variable}`}>
      <body className="font-secondary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

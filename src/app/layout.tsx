import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin Block Explorer | Summer of Bitcoin",
  description: "A modern Bitcoin block explorer showcasing deep protocol knowledge and technical skills. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["bitcoin", "blockchain", "explorer", "cryptocurrency", "mempool", "transactions"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

      </body>
    </html>
  );
}

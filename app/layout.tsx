import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import DonateAuthor from '@/components/DonateAuthor';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "绳网终端",
  description: "A cyberpunk terminal simulator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
          <div className="fixed bottom-6 right-6 z-50">
            <DonateAuthor />
          </div>
    </html>
  );
}

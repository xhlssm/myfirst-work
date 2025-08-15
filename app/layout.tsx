import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import DonateAuthor from '@/components/DonateAuthor';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "绳网终端",
  description: "A cyberpunk terminal simulator.",
};

const SplashParticles = dynamic(() => import('../components/ui/SplashParticles'), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);
  return (
    <html lang="zh-cn">
      <body className="bg-[#181824] text-white min-h-screen">
        {showSplash && <SplashParticles onFinish={() => setShowSplash(false)} />}
        <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.8s' }}>
          {children}
        </div>
        <div className="fixed bottom-6 right-6 z-50">
          <DonateAuthor />
        </div>
      </body>
    </html>
  )
}

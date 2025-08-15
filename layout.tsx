import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import DonateAuthor from '@/components/DonateAuthor';
"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SignInPanel from '../components/ui/SignInPanel';

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
      <body className="min-h-screen text-white" style={{
        background: 'linear-gradient(135deg, #181824 0%, #232946 60%, #1A1A2E 100%)',
        position: 'relative',
        overflowX: 'hidden',
      }}>
        {/* 赛博发光线条背景 */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}>
          <svg width="100vw" height="100vh" style={{ width: '100vw', height: '100vh', display: 'block' }}>
            <defs>
              <linearGradient id="glow1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00e4ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <line x1="0" y1="0" x2="100vw" y2="100vh" stroke="url(#glow1)" strokeWidth="4" filter="url(#glow)" />
            <line x1="0" y1="100vh" x2="100vw" y2="0" stroke="url(#glow1)" strokeWidth="2" filter="url(#glow)" />
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </svg>
        </div>
        <SignInPanel />
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

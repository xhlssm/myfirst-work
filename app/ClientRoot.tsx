'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DonateAuthor from '@/components/DonateAuthor';
import SignInPanel from '@/components/ui/SignInPanel';

// 错误边界组件
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {
    // 可上报错误
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('SplashParticles error:', error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return <div style={{position:'fixed',inset:0,background:'#181824',zIndex:9999,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>动画加载失败</div>;
    }
    return this.props.children;
  }
}

const SplashParticles = dynamic(
  () => import('@/components/ui/SplashParticles'),
  {
    ssr: false,
    loading: () => (
      <div style={{position:'fixed',inset:0,background:'#181824',zIndex:9999,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24}}>
        动画加载中...
      </div>
    ),
  }
);

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [splashTimeout, setSplashTimeout] = useState(false);

  // 动画超时兜底（如动画组件未加载或onFinish未触发，3秒后自动关闭）
  React.useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setSplashTimeout(true);
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showSplash]);

  // loading时主内容渐显，避免白屏
  const mainOpacity = showSplash ? 0.2 : 1;

  return (
    <div
      className='min-h-screen text-white'
      style={{
        background: 'linear-gradient(135deg, #181824 0%, #232946 60%, #1A1A2E 100%)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* 赛博发光线条背景 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <svg width='100vw' height='100vh' style={{ width: '100vw', height: '100vh', display: 'block' }}>
          <defs>
            <linearGradient id='glow1' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0%' stopColor='#00e4ff' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#ff00ff' stopOpacity='0.1' />
            </linearGradient>
          </defs>
          <line x1='0' y1='0' x2='100vw' y2='100vh' stroke='url(#glow1)' strokeWidth='4' filter='url(#glow)' />
          <line x1='0' y1='100vh' x2='100vw' y2='0' stroke='url(#glow1)' strokeWidth='2' filter='url(#glow)' />
          <filter id='glow'>
            <feGaussianBlur stdDeviation='8' result='coloredBlur' />
            <feMerge>
              <feMergeNode in='coloredBlur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </svg>
      </div>
      {showSplash && !splashTimeout && (
        <ErrorBoundary>
          <SplashParticles onFinish={() => setShowSplash(false)} />
        </ErrorBoundary>
      )}
      <SignInPanel />
      <div style={{ opacity: mainOpacity, transition: 'opacity 0.8s' }}>{children}</div>
      <div className='fixed bottom-6 right-6 z-50'>
        <DonateAuthor />
      </div>
    </div>
  );
}

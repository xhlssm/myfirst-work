import React, { useEffect, useRef } from 'react';

// 粒子参数可根据需要调整
const PARTICLE_COUNT = 80;
const PARTICLE_COLOR = '#00e4ff';
const PARTICLE_SIZE = 2;
const FADE_DURATION = 1200; // ms

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const SplashParticles: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const fadeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // 粒子初始化
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
      alpha: randomBetween(0.7, 1),
      size: randomBetween(PARTICLE_SIZE, PARTICLE_SIZE * 2),
      color: PARTICLE_COLOR,
    }));

    let start: number | null = null;
    let fadeOut = false;
    let finished = false;

    function safeFinish() {
      if (finished) return;
      finished = true;
      if (onFinish) onFinish();
    }

    function draw(ts: number) {
      if (!start) start = ts;
      ctx.clearRect(0, 0, width, height);
      // 粒子运动
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.save();
        ctx.globalAlpha = fadeOut ? p.alpha * (1 - fadeRef.current) : p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#00e4ff';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
      if (fadeOut) {
        fadeRef.current += 16 / FADE_DURATION;
        if (fadeRef.current >= 1) {
          safeFinish();
          return;
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    animationRef.current = requestAnimationFrame(draw);

    // 监听窗口变化
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // 2秒后淡出
    const timer = setTimeout(() => {
      fadeOut = true;
    }, 1200);

    // 兜底：2.5秒后强制触发onFinish，彻底防止卡死
    const forceFinishTimer = setTimeout(() => {
      safeFinish();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(forceFinishTimer);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      inset: 0,
      background: 'radial-gradient(ellipse at center, #181824 60%, #232946 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.8s',
      pointerEvents: 'none',
    }}>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        color: '#fff',
        fontSize: 40,
        fontWeight: 700,
        letterSpacing: 2,
        textShadow: '0 0 24px #00e4ff',
        userSelect: 'none',
      }}>
        WANG 社区
      </div>
    </div>
  );
};

export default SplashParticles;

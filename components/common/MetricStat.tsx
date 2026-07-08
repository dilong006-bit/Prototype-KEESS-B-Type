'use client';

import { useEffect, useRef, useState } from 'react';

interface MetricStatProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  countUp?: boolean;
}

/** 큰 숫자 + 짧은 라벨 (Design.md §5). countUp: 뷰포트 진입 시 카운트업. */
export default function MetricStat({
  value,
  label,
  suffix = '',
  prefix = '',
  countUp = true,
}: MetricStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(countUp ? 0 : value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!countUp || rm) {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const dur = 1200;
            const st = performance.now();
            const tick = (n: number) => {
              const p = Math.min((n - st) / dur, 1);
              setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, countUp]);

  return (
    <div ref={ref}>
      <div style={{ fontSize: 'clamp(30px,4vw,44px)', fontWeight: 800, letterSpacing: '-.02em' }} className="num">
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </div>
      <div style={{ marginTop: 8, fontSize: 14.5, color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}

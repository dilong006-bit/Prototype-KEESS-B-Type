'use client';

import { useEffect, useRef, useState } from 'react';

/** 뷰포트 진입 시 0→value 카운트업 (reduced-motion 시 즉시). */
export default function CountNum({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rm) { setN(value); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) {
          const dur = 1000, st = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - st) / dur, 1);
            setN(Math.round((1 - Math.pow(1 - p, 3)) * value));
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
  }, [value]);

  return <span ref={ref} className={`num ${className || ''}`.trim()}>{n}</span>;
}

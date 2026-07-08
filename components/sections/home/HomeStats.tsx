'use client';

import { useEffect, useRef } from 'react';
import { STATS } from '@/data/home';

const CIRC = 326.726;

export default function HomeStats() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ring stroke
    const rio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const fg = e.target as SVGCircleElement;
            const pct = parseFloat(fg.dataset.pct || '0');
            (fg as unknown as HTMLElement).style.strokeDashoffset = String(CIRC * (1 - pct));
            rio.unobserve(e.target);
          }
        }),
      { threshold: 0.5 }
    );
    root.querySelectorAll('.ring .fg').forEach((el) => rio.observe(el));

    // count-up
    const cup = (el: HTMLElement) => {
      const t = +(el.dataset.count || '0');
      const dur = 1200;
      const st = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - st) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * t).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            if (rm) el.textContent = (+(el.dataset.count || '0')).toLocaleString();
            else cup(el);
            cio.unobserve(e.target);
          }
        }),
      { threshold: 0.6 }
    );
    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => cio.observe(el));

    return () => {
      rio.disconnect();
      cio.disconnect();
    };
  }, []);

  return (
    <section className="section stats" ref={rootRef}>
      <div className="wrap">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label} style={{ ['--ac' as string]: s.ac }}>
              <div className="ring">
                <svg viewBox="0 0 120 120">
                  <circle className="bg" cx="60" cy="60" r="52" />
                  <circle className="fg" cx="60" cy="60" r="52" data-pct={s.pct} />
                </svg>
                <div className="val">
                  <span className="num" data-count={s.count}>0</span>
                  {s.suffix}
                </div>
              </div>
              <div className="lab">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

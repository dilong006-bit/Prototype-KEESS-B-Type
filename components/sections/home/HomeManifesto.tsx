'use client';

import { useEffect, useRef } from 'react';
import Img from '@/components/common/Img';
import { MANIFESTO } from '@/data/home';

export default function HomeManifesto() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 등장 (man-scrim/h2 in)
    const mio = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.3 }
    );
    mio.observe(sec);

    // 패럴럭스
    const man = sec.querySelector<HTMLElement>('.man-img');
    let tick = false;
    function upd() {
      if (!man) return;
      const r = sec!.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        const prog = (vh - r.top) / (vh + r.height);
        man.style.transform = `translateY(${((prog - 0.5) * 38).toFixed(1)}px) scale(1.09)`;
      }
      tick = false;
    }
    const onScroll = () => {
      if (!tick) {
        requestAnimationFrame(upd);
        tick = true;
      }
    };
    if (man && !rm) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    }
    return () => {
      mio.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', upd);
    };
  }, []);

  return (
    <section className="manifesto" id="manifesto" ref={secRef}>
      <div className="man-bg" />
      <Img className="man-img" src={MANIFESTO.img} />
      <div className="man-scrim" />
      <div className="wrap"><h2>{MANIFESTO.heading}</h2></div>
    </section>
  );
}

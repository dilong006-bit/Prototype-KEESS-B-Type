'use client';
import { useEffect } from 'react';

/**
 * 스크롤 리빌 (Design.md §6 · TECHSPEC §8)
 * IntersectionObserver({threshold:.16}) 1회 관찰 → `in` 부여, unobserve.
 * .stagger 자식 순차 delay. prefers-reduced-motion 시 즉시 표시.
 * 셀렉터 기반 초기화 — 페이지 마운트 후 .r/.stagger/.lines/.prule/.midrule 관찰.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = Array.from(
      document.querySelectorAll('.r, .stagger, .lines, .prule, .midrule')
    );

    // stagger 자식 delay
    document.querySelectorAll('.stagger').forEach((g) => {
      Array.from(g.children).forEach((c, i) => {
        (c as HTMLElement).style.transitionDelay = i * 0.09 + 's';
      });
    });

    if (rm) {
      targets.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.16 }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

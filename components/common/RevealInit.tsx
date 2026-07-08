'use client';

import { useReveal } from '@/lib/useReveal';

/** 페이지 마운트 후 .r/.stagger/.lines/.prule/.midrule 리빌 관찰 시작. */
export default function RevealInit() {
  useReveal([]);
  return null;
}

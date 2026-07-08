import type { Config } from 'tailwindcss';

/**
 * Design.md §3 토큰 1:1 매핑. 모든 값은 globals.css :root의 CSS 변수를 경유한다.
 * 신규 값 추가 금지 — 색·간격·라운드·그림자·폰트·브레이크포인트는 확정 토큰만.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // Design.md §4 확정 브레이크포인트(max-width 기반). 신규 임의 브레이크포인트 금지.
    screens: {
      'mx-1040': { max: '1040px' },
      'mx-940': { max: '940px' },
      'mx-880': { max: '880px' },
      'mx-820': { max: '820px' },
      'mx-760': { max: '760px' },
      'mx-740': { max: '740px' },
      'mx-720': { max: '720px' },
      'mx-640': { max: '640px' },
      'mx-560': { max: '560px' },
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        surface: 'var(--surface)',
        p1: 'var(--p1)',
        p2: 'var(--p2)',
        p3: 'var(--p3)',
        p4: 'var(--p4)',
        gov: 'var(--gov)',
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'Pretendard Variable', 'Pretendard', 'system-ui', 'sans-serif'],
        serif: ['var(--font-gowun)', 'Gowun Batang', 'serif'],
      },
      maxWidth: {
        wrap: 'var(--maxw)',
      },
      borderRadius: {
        token: 'var(--r)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
      },
      transitionTimingFunction: {
        ease: 'var(--ease)',
        'ease-out-token': 'var(--ease-out)',
      },
    },
  },
  plugins: [],
};

export default config;

import localFont from 'next/font/local';
import { Gowun_Batang } from 'next/font/google';

/**
 * Pretendard Variable — self-host (TECHSPEC §3.1, F2·R8).
 * 전 페이지 통일. CDN·Malgun 폴백 스택 이식 금지.
 */
export const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

/**
 * Gowun Batang (serif) — 홈 매니페스토 등 선언형 대형 문구 한정.
 */
export const gowun = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-gowun',
});

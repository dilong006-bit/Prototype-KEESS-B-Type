import type { Metadata } from 'next';
import './globals.css';
import { pretendard, gowun } from './fonts';

export const metadata: Metadata = {
  title: 'KEESS — KG에듀원 기업교육',
  description: '진단으로 설계하고, 효과로 증명합니다. KG에듀원 HRD사업본부 기업·기관 교육 도입 채널.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${gowun.variable}`}>
      <body>{children}</body>
    </html>
  );
}

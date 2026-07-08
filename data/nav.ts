// GNB 라우팅 (Design.md §0.5-1 · 무동작 금지 · 실제 페이지 이동)
export type NavKey = 'home' | 'ax-ai' | 'leadership' | 'hrd' | 'content';

export interface NavItem {
  key: NavKey | 'gov';
  label: string;
  href: string;
}

// AX·AI→/ax-ai, 리더십·조직→/leadership, HRD 통합→/hrd, 콘텐츠→/content, 정부지원→/hrd#gov
export const NAV_ITEMS: NavItem[] = [
  { key: 'ax-ai', label: 'AX·AI 전환', href: '/ax-ai' },
  { key: 'leadership', label: '리더십·조직', href: '/leadership' },
  { key: 'hrd', label: 'HRD 통합 솔루션', href: '/hrd' },
  { key: 'content', label: '콘텐츠 솔루션', href: '/content' },
  { key: 'gov', label: '정부지원', href: '/hrd#gov' },
];

// 홈 로고 = 홈(/) (Design.md §0.5-2)
export const LOGO = { label: 'KEESS', href: '/' };

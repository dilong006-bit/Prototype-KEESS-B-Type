// 리드 폼 (TECHSPEC §6-5) — 전송 없음, 검증 통과 시 성공 상태
export interface LeadFormData {
  company: string;
  name: string;
  contact?: string;
  email: string;
  interest?: 'P1' | 'P2' | 'P3' | 'P4' | '정부지원 환급' | '콘텐츠';
  message?: string;
  source: 'consult' | 'guide' | 'download' | 'gov';
}

export interface SubNavItem {
  id: string;
  label: string;
}

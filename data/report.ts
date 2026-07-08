// 부정훈련 신고 — 시드 데이터 (홈 원본 1008-1012 1:1 · 클라이언트 데모)
export interface ReportRecord {
  no: string;
  name: string;
  phone: string;
  pw: string;
  title: string;
  content: string;
  status: number; // 0 접수 완료 · 1 검토 중 · 2 처리 완료 · 3 반려
  date: string;
  answer?: string;
}

export const REPORT_SEED: ReportRecord[] = [
  {
    no: 'KR-20260701-0012',
    name: '홍길동',
    phone: '010-1234-5678',
    pw: 'test',
    title: '훈련 미실시 의심 신고',
    content: '승인된 차시와 다르게 운영된 정황이 있어 신고합니다.',
    status: 1,
    date: '2026-07-01',
  },
  {
    no: 'KR-20260628-0007',
    name: '홍길동',
    phone: '010-1234-5678',
    pw: 'test2',
    title: '대리 수강 정황 신고',
    content: '타인이 대신 수강한 것으로 보이는 정황이 있어 신고합니다.',
    status: 2,
    date: '2026-06-28',
    answer: '접수 내용 확인 후 해당 기관에 대한 지도점검을 완료했습니다. 협조해 주셔서 감사합니다.',
  },
];

export const REPORT_STATUS = ['접수 완료', '검토 중', '처리 완료', '반려'];

// P3 HRD 통합 솔루션, 카피/데이터 verbatim (keess_P3_hrd_B_platform_v2.0)
// 색·버튼변형 미이식. 바이올렛은 --p3, 정부지원 포인트는 --gov(Design.md 확정 토큰).

export const HERO = {
  tag: 'KG에듀원 HRD 통합 솔루션 · Platform',
  h1Lead: 'HRD 운영의 모든 것을,',
  h1Emph: '하나의 플랫폼에서',
  sub: '시스템 · 운영 · 콘텐츠 제작을 단일 아키텍처로 연결합니다. 구축부터 차세대 시스템까지, 벤더를 늘리지 않고 통합 제공합니다.',
  img: '/images/p3-hero.jpg',
  ctaPrimary: '도입 문의',
  ctaSecondary: '차세대 데모 둘러보기 →',
  metrics: [
    { v: '3', unit: '축', l: '풀스택 통합' },
    { v: '30', unit: '+', l: '기업 운영' },
    { v: '2', unit: '만', l: '동시접속' },
    { v: '3', unit: '개소', l: '자체 스튜디오' },
  ],
};

export const ARCH = {
  eyebrow: 'PLATFORM ARCHITECTURE',
  title: '4개 축으로 완성되는 HRD 플랫폼',
  lead: '개별 솔루션의 나열이 아닙니다. 하나의 아키텍처로 연결된 통합 플랫폼입니다.',
  cells: [
    { cls: 'c-sys', bk: 'B3-1 · 시스템', h3: '맞춤형 HRD 연수원', p: 'LMS + 전용 APP · 온·오프 하이브리드 · ISMS · 동시접속 2만', chips: ['WEB·Mobile UI 통일', 'iOS·Android·PUSH', '365일 24h'] },
    { cls: 'c-ops', bk: 'B3-2 · 운영', h3: 'HRD 운영 위탁', p: 'HOW 7축 · 30+사 실적' },
    { cls: 'c-studio hi', bk: 'B3-3 · 제작 ★', h3: '콘텐츠 스튜디오', p: '자체 3개소 · 촬영·제작팀 · 자체 IP' },
    { cls: 'c-kgesa wide', bk: 'B3-4 · 차세대 (KGESA)', h3: '노코드 사이트 빌더', p: '운영자가 테마·위젯을 조작하면 학습자 화면이 실시간 완성, 개발 요청 제로', demoLink: true },
  ],
  svcHead: { eyebrow: 'SERVICE MODEL', title: '복잡한 건 시스템이, 담당자는 클릭만', sub: '기획·구성부터 성과 관리까지, 어려운 일은 시스템이 처리하고, 담당자는 클릭으로 끝냅니다.' },
  svc: [
    { svn: '01 · 기획·구성', b: '학습자 화면을 직접 구성', p: '개발 요청 없이 테마·위젯만으로', svp: '교육 담당자 포털' },
    { svn: '02 · 운영·모니터링', b: '교육 현황을 한 곳에서', p: '수강·진도·이력 통합 관리', svp: '관리자 포털' },
    { svn: '03 · 학습자 지원', b: '문의 대응을 자동으로', p: 'AI FAQ 챗봇 + 실시간 질의응답', svp: '튜터존' },
    { svn: '04 · 성과 관리', b: '통계·피드백을 자동으로', p: '학습 통계·리포트 자동 생성', svp: '학습 통계' },
  ],
};

export const STUDIO = {
  eyebrow: 'CORE ADVANTAGE · KG에듀원 핵심 특장점',
  title: '기획부터 제작까지, 자체 인프라로',
  img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1400&auto=format&fit=crop',
  badge: '자체 스튜디오 3개소',
  lead: '노량진 · 종로3가 · 서대문, 직접 운영하는 촬영·제작팀이 콘텐츠를 만듭니다. 단가·일정·품질을 예측 가능하게 통제합니다.',
  list: [
    { b: '자체 스튜디오 3개소', s: '인하우스 촬영 환경' },
    { b: '직접 운영 제작팀', s: '촬영·편집·기획' },
    { b: 'AI 활용 콘텐츠 제작', s: '영상·이미지·음성까지 AI 기반 제작 지원' },
    { b: '자체 IP 8종', s: '24년 직장 오락실 실증' },
  ],
};

export const DEMO = {
  eyebrow: 'B3-4 · KGESA · INTERACTIVE TOUR',
  title: '클릭 몇 번으로, 학습자 화면 완성',
  tbd: '정식 오픈 예정',
  lead: '개발 없이 테마와 위젯만 조작하면 학습자 화면(FO)이 실시간으로 완성됩니다. 아래에서 직접 조작해 보세요.',
  widgets: [
    { id: 'banner', n: '메인 배너', on: true },
    { id: 'dash', n: '학습 대시보드', on: true },
    { id: 'courses', n: '과정 리스트', on: true },
    { id: 'reco', n: '추천 강의', on: true },
    { id: 'debate', n: '디베이트', on: false },
    { id: 'float', n: '플로팅 메뉴', on: false },
  ],
  foMenu: ['수강신청', '나의 강의실', '부가학습', '학습자료실'],
  ctrlHint: '테마를 바꾸거나 위젯을 켜고 끄고 순서를 조정해 보세요. 왼쪽 학습자 화면이 즉시 반영됩니다.',
};

export const AI = {
  eyebrow: 'GENERATIVE AI',
  title: '생성형 AI와 함께하는 학습 여정',
  tbd: '정식 오픈 예정',
  lead: 'KGESA는 담당자와 학습자 양쪽을 AI로 지원합니다. 운영은 가볍게, 학습은 밀착으로.',
  roles: [
    { art: 'FOR 담당자', b: 'AI 운영 지원', p: 'AI FAQ 챗봇이 반복 문의를 자동 응대하고, 운영 현황을 정리해 담당자의 손을 덜어줍니다.', hi: false },
    { art: 'FOR 학습자', b: '튜터존 · AI 튜터', p: '막히는 순간 즉시 답하고, 깊은 질문은 튜터존에서 실시간으로 질의응답·밀착 피드백합니다.', hi: true },
  ],
  matrixHead: ['학습 단계', 'AI가 하는 일', '기반 기능'],
  matrix: [
    { k: '학습 전', a: '맞춤 과정·콘텐츠 추천', t: 'K디지털콘텐츠 · 아카이브' },
    { k: '학습 중', a: '즉시 답변 · 실시간 질의응답', t: 'AI FAQ 챗봇 · 튜터존' },
    { k: '학습 후', a: '진도·성과 분석 · 피드백', t: '학습 통계' },
  ],
  roadmapLabel: '고도화 계획',
  roadmap: [
    { rmt: 'NOW', b: '구축 완료', p: 'AI FAQ 챗봇 · 튜터존 · 3-포털', now: true },
    { rmt: 'NEXT', b: '생성형 AI 고도화', p: '추천·큐레이션 개인화 강화' },
    { rmt: 'FUTURE', b: '플랫폼 확장', p: '연수원 라인업 · 적응형 학습' },
  ],
};

export const MODULES = {
  eyebrow: 'SOLUTION MODULES',
  title: '흩어진 HRD를, 하나로',
  lead: '시스템·운영·제작을 따로 계약하지 않습니다. 필요한 모듈을 골라 하나로 운영합니다.',
};

export interface Mod { k: string; t: string; d: string; f: [string, string][] }
export const MOD: Mod[] = [
  { k: 'B3-1 · 시스템', t: '맞춤형 HRD 연수원 (LMS + 전용 APP)', d: '온·오프 통합 하이브리드 학습환경', f: [['하이브리드 학습', '온·오프 통합'], ['맞춤 LMS', 'WEB·Mobile UI 통일'], ['전용 APP', 'iOS·Android·PUSH'], ['ISMS 인증', '정보보호 체계'], ['동시접속 2만', '365일 24h'], ['확장 구조', '고객사별 맞춤']] },
  { k: 'B3-2 · 운영', t: 'HRD 운영 위탁 (HOW 7축)', d: '30개 이상 기업 운영 실적', f: [['VOC SLA', '즉시 / 24H / 48H'], ['AI 챗봇', '24h 자동 응대'], ['운영자 이중화', '정·부 체계'], ['학습 라이프사이클', '4단계 관리'], ['3단 필터', '품질 검수'], ['5단 장애대응', '마이그레이션 30일']] },
  { k: 'B3-3 · 제작 ★', t: '콘텐츠 제작 스튜디오 (자체 3개소)', d: '노량진 · 종로3가 · 서대문 · KG 핵심 특장점', f: [['자체 스튜디오 3개소', '인하우스'], ['제작팀', '촬영·편집·기획'], ['연 50시간', '무상 제작'], ['핵심가치·승진자', '무료 교육'], ['자체 IP 8종', '24년 실증'], ['품질 일관성', '단가·일정 예측']] },
];

export const TRUST = {
  eyebrow: 'PROVEN AT SCALE',
  title: '검증된 운영 규모',
  metrics: [
    { v: '30', unit: '+', l: '운영 기업' },
    { v: '2', unit: '만', l: '동시접속 처리' },
    { v: '99.9', unit: '%', l: '서비스 가동률', em: '예시' },
    { v: '24/7', unit: '', l: '운영 지원 체계' },
  ],
  logoLabel: '도입 고객사',
  logos: [
    { t: 'HRD FLEX' }, { t: '저축은행중앙회' }, { t: '미래에셋증권' }, { t: 'KESCO The NEW' },
    { t: '○○그룹', em: '예시' }, { t: '○○금융', em: '예시' }, { t: '○○공단', em: '예시' }, { t: '○○대학', em: '예시' },
  ],
  certLabel: '인증 · 보안',
  certLabelEm: '예시',
  certs: ['ISMS', 'ISO 27001', 'GS 인증 1등급', '클라우드 보안'],
  certNote: '※ 인증 항목은 배치 예시입니다. 실제 노출은 홈 채널 정책에 따릅니다.',
};

// ===== 정부지원 환급 (B안 신규 · SPEC_P3 §3) =====
export const GOV = {
  eyebrow: 'GOVERNMENT SUPPORT · 정부지원 환급',
  title: '교육비, 정부지원으로 돌려받으세요',
  lead: '고용보험에 가입한 사업주라면 위탁훈련비의 상당 부분을 환급받을 수 있습니다. 복잡한 인정신청부터 비용 정산까지, KG에듀원이 위탁 훈련기관으로서 전 과정을 대행합니다.',
  cards: [
    { gk: 'WHO · 지원 대상', b: '고용보험 가입 사업주', p: '재직근로자·채용예정자 대상 훈련이면, 기업 규모와 무관하게 신청할 수 있습니다.', hi: false },
    { gk: 'HOW MUCH · 환급 규모', b: '훈련비 최대 90% 환급', bnum: '90%', em: '우선지원기업 기준', p: '기업 규모·과정 유형에 따라 지원율이 달라집니다. 정확한 환급액은 상담 시 산정해 드립니다.', hi: true },
    { gk: 'WHAT WE DO · KG에듀원 대행', b: '신청부터 정산까지 대행', p: '인정신청·실시신고·비용신청·지원금 정산, 담당자는 교육에만 집중하세요.', hi: false },
  ],
  steps: [
    { gsn: 'STEP 1', b: '훈련과정 인정신청', p: '위탁 7일 · 자체 5일 전' },
    { gsn: 'STEP 2', b: '훈련 실시 · 수료', p: '집체 80% 출석 / 원격 진도 80%+평가' },
    { gsn: 'STEP 3', b: '비용지원 신청', p: '수료 후 14일 이내' },
    { gsn: 'STEP 4', b: '지원금 지급', p: 'KG에듀원이 대행 신청' },
  ],
  ctaCopy: '우리 회사는 얼마나 지원받을 수 있을까요?',
  ctaSub: '고용보험 가입 여부와 대상 인원만 알려주시면, 예상 환급 규모와 맞춤 과정을 안내해 드립니다.',
  crossLink: { label: '환급 가능 과정 리스트 보기 →', href: '/content#download' },
  cta: '지원 가능 여부 상담 →',
  preselect: '정부지원 환급',
  note: '※ 지원율·한도는 「고용보험법」 등 관계 법령 및 연도별 고시에 따릅니다. 표기 수치는 우선지원대상기업 기준 예시이며, 실제 환급액은 기업 규모·과정에 따라 상담 시 산정됩니다. (출처: 고용노동부 · 한국산업인력공단 HRD4U)',
};

export const INQ = {
  title: 'HRD 통합 솔루션,\n진단부터 시작하세요',
  sub: '조직의 과제를 먼저 진단하고 필요한 교육·운영·시스템을 하나로 연결해 드립니다.\n문의를 남겨주시면 담당 컨설턴트가 확인 후 연락드립니다.',
  interests: ['HRD 통합 솔루션(P3)', 'AX·AI 전환(P1)', '콘텐츠 솔루션(P4)', '정부지원 환급'],
  successTitle: '문의가 접수되었습니다',
  successMsg: '담당자가 확인 후 연락드리겠습니다.',
};

export const MODAL = {
  title: '도입 문의',
  body: '아래 문의 폼으로 이동합니다. 우리 조직에 맞는 HRD 통합 솔루션을 함께 설계해 드리겠습니다.',
  cta: '문의 폼으로 이동',
};

export const SUBNAV = [
  { id: 'arch', label: '아키텍처' },
  { id: 'studio', label: '특장점' },
  { id: 'demo', label: '차세대 데모' },
  { id: 'ai', label: 'AI' },
  { id: 'modules', label: '솔루션 모듈' },
  { id: 'trust', label: '운영 규모' },
  { id: 'gov', label: '정부지원' },
  { id: 'inq', label: '도입문의' },
];

# KEESS B안 — 기술명세서 (Technical Specification)

| 항목 | 내용 |
|------|------|
| **Version** | 1.0 |
| **기준 PRD** | `../prd/PRD_KEESS_B_v1.0.md` (F1~F18) |
| **상위 기준** | `../design/Design.md` · `../prototype/*`(B안 확정본) |
| **작성일** | 2026-07-08 |
| **Status** | Ready for Build |
| **다음 단계** | Claude Code 빌드 프롬프트 |

> 본 문서는 PRD의 F-ID를 **아키텍처·컴포넌트 계약·데이터 스키마·인터랙션 로직·배포**로 구체화한다. 원본 프로토타입의 마크업·카피는 **확정본을 source of truth로 이식**한다(재작성 금지).

---

## 1. 기술 스택
- **Next.js (App Router) + React + TypeScript + Tailwind CSS v3.4**. A-Type 빌드와 동일 스택으로 고정(Tailwind는 v3.4로 핀 — `tailwind.config.ts` 토큰 매핑 방식).
- 폰트: **Pretendard Variable을 `next/font/local`로 self-host**(전 페이지 통일) + `next/font/google`(Gowun Batang, 홈 액센트 한정). §3.1 준수.
- 백엔드 없음: 폼·다운로드는 클라이언트 상태 + 정적 자산. 실전송은 추후 엔드포인트 슬롯.
- 렌더: 전 페이지 **정적(SSG)**. 인터랙션은 client component.

## 2. 레포 구조
```
KEESS_B-Type/
├─ app/
│  ├─ layout.tsx                 # 폰트·글로벌·Nav·Footer 셸
│  ├─ globals.css                # 디자인 토큰(:root) + 필러 틴트 + base
│  ├─ page.tsx                   # / (홈)
│  ├─ ax-ai/page.tsx             # /ax-ai (P1)
│  ├─ leadership/page.tsx        # /leadership (P2 B)
│  ├─ hrd/page.tsx               # /hrd (P3 B v2.0)
│  └─ content/page.tsx           # /content (P4 B v2.0)
├─ components/
│  ├─ common/   # Nav, MobileMenu, Footer, SubNav, Section, SectionHeader,
│  │            # Button, Chip, Badge, Card, MetricStat, Modal, ToTop,
│  │            # Reveal, LeadForm, GovBadge
│  └─ sections/ # 페이지별 섹션 (home/*, axai/*, leadership/*, hrd/*, content/*)
├─ data/        # home.ts, axai.ts, leadership.ts, hrd.ts, content.ts,
│               # courses.ts(P4 34종), gov.ts(P3), download.ts(P4)
├─ lib/         # useReveal.ts, useModal.ts, constants.ts, types.ts
├─ public/
│  ├─ fonts/PretendardVariable.woff2
│  ├─ images/...                 # 실사 교체 슬롯
│  └─ downloads/KG에듀원_과정리스트.xlsx
├─ tailwind.config.ts
├─ next.config.ts · tsconfig.json · package.json
└─ CLAUDE.md                     # 빌드 규칙(Design.md 요약)
```

## 3. 디자인 토큰 레이어 (Design.md §3, 1:1)
`app/globals.css :root`:
```css
:root{
  --bg:#FAFAFB; --ink:#14141A; --muted:#54585f; --line:#E6E8EC; --surface:#F3F5F8;
  --p1:#2E1A6B; --p2:#E91E63; --p3:#8B27A8; --p4:#F58220; --gov:#F4B83A;
  --ease:cubic-bezier(.22,.61,.36,1); --ease-out:cubic-bezier(.2,0,0,1);
  --maxw:1200px; --gut:24px; --serif:"Gowun Batang",serif; --r:20px;
  --shadow-1:0 1px 2px rgba(20,20,26,.05),0 2px 8px rgba(20,20,26,.05);
  --shadow-2:0 2px 6px rgba(20,20,26,.06),0 10px 26px rgba(20,20,26,.09);
  --shadow-3:0 6px 14px rgba(20,20,26,.08),0 22px 52px rgba(20,20,26,.14);
}
```
**필러 틴트 (페이지 wrapper 클래스, 4값만 오버라이드):**
- `.tint-p1`(보라): `--bg:#FCFCFE --surface:#F4F2FB --ink:#15131D --line:#EAE8F2`
- `.tint-p2`(마젠타): `--bg:#FDFBFC --surface:#FCEBF2 --ink:#181318 --line:#F0E3EA`
- `.tint-p3`(바이올렛): `--surface:#F4EAFA --line:#ECE0F4 --ink:#1A1420`
- `.tint-p4`(웜): `--surface:#F7F4EF --ink:#15131D`
- 홈: 틴트 없음(중립). 필러 페이지는 `--maxw:1180px` 사용.

`tailwind.config.ts`: colors/spacing/borderRadius/boxShadow/fontFamily를 위 CSS 변수에, `screens`는 확정 max-width 브레이크포인트(1040/940/880/820/760/740/720/640/560)에 매핑. **신규 값 추가 금지.**

### 3.1 폰트 & 디자인 시스템 일관성 (★ 프리텐다드 기준, F2·R8)
- **단일 원천**: 본문·UI = **Pretendard Variable**, `next/font/local`로 **self-host**(`public/fonts/PretendardVariable.woff2`, `weight:"45 920"`, `variable:"--font-pretendard"`). `app/layout.tsx`에서 `<html>`에 클래스 부여 → 전 페이지 상속. `body{font-family:var(--font-pretendard),"Pretendard Variable",Pretendard,system-ui,sans-serif}`.
- **원본 정규화(필수)**: `ref/prototype` 원본은 폰트 선언이 불일치함 —
  - 홈·P1·P4: `"Pretendard Variable"` + jsDelivr CDN 로드.
  - P2 B·P3 B: `"Pretendard","맑은 고딕","Malgun Gothic"` + **웹폰트 미로드**(로컬 설치 의존 → 머신별 렌더 상이).
  → 빌드 시 **CDN 링크·Malgun 폴백 스택을 옮기지 말고**, 전 페이지를 self-host Pretendard Variable 하나로 통일한다.
- **serif**: `--serif:"Gowun Batang"`은 **홈 매니페스토 등 선언형 대형 문구에만** 제한(확정 홈). 필러 페이지는 Pretendard 단일. 신규 서체 금지.
- **검증**: 5경로에서 동일 자족(자간·굵기) 렌더, 로컬 Pretendard 미설치 환경에서도 동일해야 함(self-host 확인).

## 4. 라우트 ↔ 원본 매핑
| route | component wrapper | 원본(source of truth) | tint |
|---|---|---|---|
| `/` | (none) | `keess_home_C_v18_최종확정` | 중립 |
| `/ax-ai` | `.tint-p1` | `keess_P1_AXAI_D_scenario_v7` | 보라 |
| `/leadership` | `.tint-p2` | `keess_P2_leadership_B_framework_v1.0` | 마젠타 |
| `/hrd` | `.tint-p3` | `keess_P3_hrd_B_platform_v2.0` | 바이올렛 |
| `/content` | `.tint-p4` | `keess_P4_content_solution_B_v2.0` | 웜 |

## 5. 공통 컴포넌트 계약 (props)
```ts
// 데이터 주입형. 카피는 data/*.ts에서 주입(하드코딩 금지).
// ★ Design.md §0.5 6대 원칙 필수 반영 (아래 Nav/Footer/CTA)
Nav({ current: 'home'|'ax-ai'|'leadership'|'hrd'|'content' })
  // §0.5-1 GNB 각 항목 = Next <Link>로 실제 라우팅(/ax-ai·/leadership·/hrd·/content, 정부지원=/hrd#gov),
  //         current와 일치하는 항목에 aria-current="page". 무동작·placeholder 금지.
  // §0.5-2 좌측 상단 KEESS 로고 = <Link href="/">(홈). 홈에서는 최상단 스크롤.
  // §0.5-6 우측 "교육 상담" 고정 CTA = Button variant='primary'(고대비 pill+아이콘, hover 상승,
  //         원래 그라데이션 영역이면 톤 정합 그라데이션). 최상 체감으로 강화.
MobileMenu({ open, onClose, items })  // items = GNB와 동일 라우팅 링크(§0.5-1)
Footer()                              // 다크, 채널분리 안내. §0.5-5 전 페이지 공통(동일 인스턴스).
                                      // 부정훈련 예방/신고 버튼 2개 포함 → ReportModal 연결(필수·누락 금지)
SubNav({ items: {id,label}[], activeId })   // 스크롤스파이
Section({ id?, tint?, dark?, children })
SectionHeader({ eyebrow, title, sub?, align? })
Button({ variant:'primary'|'glass'|'line'|'ghost', onClick?, href?, children })
Card({ variant?, children })
MetricStat({ value, label, countUp? })
Chip({children}) · Badge({tone?, children})
Modal({ id, open, onClose, labelledBy, children })  // 포커스 트랩·ESC·스크림
Reveal({ as?, stagger?, children })   // useReveal 래퍼
LeadForm({ context?, preselect?, fields, onSuccess })  // 검증·성공상태
GovBadge({ href })                    // --gov 크로스 배지(F18)
ReportModal({ open, onClose, initialTab })  // 부정훈련 예방/신고(3탭·신고폼·조회) — 홈 Footer, A/B 공통 고정. id 'pv-title' 중복 분리, 백엔드 없음(성공/데모 UI)
```
- 페이지 특화 섹션 컴포넌트(`components/sections/*`)는 각 원본 섹션을 1:1 이식하되 데이터는 `data/*.ts`.

## 6. 데이터 모델
### 6-1. 페이지 콘텐츠 (`data/{page}.ts`)
- 각 페이지 섹션의 카피·리스트를 타입 지정 객체로. **문구는 확정 원본 그대로**.

### 6-2. 과정 카탈로그 — P4 탐색기 (`data/courses.ts`) [F11]
```ts
interface Course {
  id: string; title: string;
  category: string; category_key: 'lit'|'data'|'prod'|'job'|'tool'|'dev';
  target: string; level: '입문'|'실무'|'심화';
  duration: string; hours: number;
  duration_band: '숏(≤4h)'|'스탠다드(5–12h)'|'인텐시브(≥13h)';
  book_provided: boolean; tools: string[]; keywords: string[];
  instructor: string|null; overview: string;
  objectives: string[]; curriculum: string[]; curriculum_count: number;
  thumbnail: string|null; detail_pdf: string;
}
```
- 초기 34종(실데이터) 그대로 이식. **차주 6+6 소개서 도착 시 교체**(마이그레이션: 배열만 교체, 스키마 유지).

### 6-3. 정부지원 — P3 (`data/gov.ts`) [F7]
```ts
interface GovContent {
  who:string; benefit:{rate:string; caveat:string};
  agency:string; steps:{step:string; title:string; note:string}[];
  refundCourseCount:number;   // 495
  crossLinkP4:string;         // /content#download
  legalNote:string; sources:string[];
}
```
- 금액 표기: `benefit.rate="우선지원기업 기준 최대 90%"` + `caveat="규모·과정별 상이, 상담 시 산정"`. 단정 금지.

### 6-4. 다운로드 — P4 (`data/download.ts`) [F9]
```ts
interface DownloadStats {
  total:'8,000여';
  items:{label:string; value:string}[]; // 직무 4,219 / 어학 3,332 / 전화 820 / 법정 25 / 신규 116 / 환급 495+
  file:'/downloads/KG에듀원_과정리스트.xlsx';
  updatedBasis:'2026-08 개강 기준'; cadence:'매월 갱신';
  crossLinkP3:string;          // /hrd#gov
}
```

### 6-5. 리드 폼 (`lib/types.ts`) [F10·F9]
```ts
interface LeadForm {
  company:string; name:string; contact?:string; email:string;
  interest?:'P1'|'P2'|'P3'|'P4'|'정부지원 환급'|'콘텐츠';
  message?:string; source:'consult'|'guide'|'download'|'gov';
}
// 전송 없음: 검증 통과 → 성공 상태. onSuccess 훅에 향후 fetch(POST) 슬롯.
```

## 7. 기능 → 모듈 매핑
| F | 모듈/파일 |
|---|---|
| F1 | `components/common/{Nav,MobileMenu,Footer,SubNav}`, `app/layout.tsx` |
| F2 | `app/globals.css`, `tailwind.config.ts` |
| F3~F8 | `components/sections/{home,axai,leadership,hrd,content}/*` + `data/*` |
| F7 | `sections/hrd/GovSection`, `data/gov.ts`, LeadForm preselect |
| F9 | `sections/content/DownloadSection`, `data/download.ts`, `useModal`, `triggerDL` |
| F10 | `common/LeadForm`, `common/Modal` |
| F11 | `sections/content/CourseExplorer`, `data/courses.ts` |
| F12 | `lib/useReveal.ts`, `common/Reveal` |
| F13 | 크로스링크(`/hrd#gov`↔`/content#download`) |
| F14/F15 | 전 컴포넌트 반응형·a11y |
| F16 | `sections/hrd/KgesaDemo` |
| F17 | `next build` + 정적 배포 |

## 8. 인터랙션 · 로직 명세
- **모달(`useModal`)**: open 시 body 스크롤 잠금, 포커스 트랩, ESC·스크림 클릭·`data-close` 닫기, 닫을 때 트리거로 포커스 복귀. `role="dialog"` `aria-modal`.
- **리빌(`useReveal`)**: `IntersectionObserver({threshold:.16})`(P4 원본은 .12 — 통일값 .16 권장) 1회 관찰 → `in` 부여. `.stagger` 자식 순차. `prefers-reduced-motion` 시 즉시 표시.
- **스크롤스파이(SubNav)**: `IntersectionObserver(rootMargin)` 로 현재 섹션 active.
- **리드 폼 검증**: 필수(회사·담당자·이메일) 공란/이메일 정규식 실패 → 필드 border 강조. 통과 → 폼 숨김·성공 블록 표시.
- **다운로드 라이트 게이트(F9)**: CTA(`data-download`) → 게이트 모달 → 검증 통과 → `triggerDL()`(동적 `<a href="/downloads/..." download>` 클릭) + 성공 상태(수동 링크 폴백). 태깅 `source:'download'`.
- **P3 정부지원 CTA(F7)**: `goToInq('정부지원 환급')` → `/hrd#inq` 스크롤 + 관심영역 프리셀렉트.
- **크로스링크(F13)**: `/content#download` ↔ `/hrd#gov`.
- **히어로 캐러셀(홈)**: 5슬라이드 자동+수동, Ken Burns, 도트.
- **KGESA 데모(F16)**: 테마 GNB/LNB·위젯 on/off·순서 → FO 미리보기 즉시 렌더.
- **Nav 라우팅·로고(§0.5-1·2)**: GNB 각 항목 = `next/link` `<Link>`로 실제 페이지 이동(`/ax-ai`·`/leadership`·`/hrd`·`/content`, 정부지원=`/hrd#gov`), `current`와 일치 항목 `aria-current="page"`. 로고 = `<Link href="/">`. 모바일 메뉴 항목도 동일 라우팅. **무동작 링크 금지.**
- **교육 상담 CTA(§0.5-6)**: nav 고정 CTA·최종 CTA는 `Button variant='primary'`로 고대비 pill+아이콘·hover 상승·active 눌림, 원래 그라데이션 영역이면 톤 정합 그라데이션. 상담 모달/`/#inq` 폼으로 수렴.
- **부정훈련 예방/신고(홈 Footer · 필수)**: `ReportModal` — 3탭(예방 안내/신고 접수/신고 조회), 신고 폼(신고자 정보·내용·동의 2건)→성공, 조회(이름·연락처+비밀번호) 데모. 원본 `pv-title` id 중복은 고유 id로 분리. **홈 빌드 범위 필수, no-op 금지.**

## 9. 비기능 요구
- **반응형**: 확정 브레이크포인트만(1040/940/880/820/760/740/720/640/560). 3디바이스 QA.
- **접근성**: 시맨틱 랜드마크, `:focus-visible`, 모달 포커스 트랩·ESC, 폼 라벨·`aria-*`, 탐색기 카드 키보드(Enter/Space), `@media(prefers-reduced-motion:reduce)`.
- **성능**: SSG, 이미지 `loading="lazy"`/`fetchpriority`, 폰트 `display:swap` self-host. Lighthouse 90+ 목표.
- **SEO**: 라우트별 `metadata`(title/description). 홈 대표 메시지 "진단으로 설계하고, 효과로 증명합니다."
- **이미지**: Unsplash 슬롯 + `onerror` 폴백. 실사 교체는 `public/images/`.

## 10. 빌드 & 배포
- `npm run dev` 개발, `npm run build`(정적) → 배포(Vercel 권장, 정적 호스팅 가능).
- 환경변수 없음. 다운로드 자산 `public/downloads/KG에듀원_과정리스트.xlsx`(16MB — 파일명 URL 인코딩/공백 주의, 무공백 권장).
- 폼 실전송: 미구현(성공 UI). 추후 `onSuccess`에 폼 엔드포인트(예: 사내 API/이메일 서비스) 연동 슬롯.

## 11. 수용 기준 / 테스트 체크리스트
- [ ] 5경로 `next build` 무오류·정적 구동.
- [ ] 각 페이지가 확정 원본과 섹션 순서·카피 일치(시각 대조).
- [ ] **[§0.5-1] GNB 각 항목 클릭 시 실제 페이지로 이동, 현재 페이지 `aria-current`** (무동작 0).
- [ ] **[§0.5-2] KEESS 로고 클릭 시 홈(`/`) 이동.**
- [ ] **[§0.5-5] Footer 전 페이지 공통 동일 렌더.**
- [ ] **[홈 필수] Footer 부정훈련 예방/신고 3탭 모달 동작(신고 접수·조회), 누락 0·no-op 0.**
- [ ] **[§0.5-6] 교육 상담 CTA 강화(고대비·hover·포커스 링·터치 44px+).**
- [ ] **[§0.5-3] 그라데이션은 원래 있던 영역만 톤 정합, 신규 다색 그라데이션 0.**
- [ ] 신규 색 토큰 0(`--gov` 포함, Design.md 값만).
- [ ] **폰트 5페이지 통일**: Pretendard Variable self-host, CDN·Malgun 폴백 잔재 0, serif는 홈 한정.
- [ ] P3 정부지원 CTA → 문의 프리셀렉트, 금액 단정 없음.
- [ ] P4 다운로드 게이트 제출 → xlsx 다운로드 + 성공 표시.
- [ ] P3↔P4 크로스링크 상호 이동.
- [ ] 탐색기 탭·필터·검색·상세 정상, 빈 상태 처리.
- [ ] 모달 포커스 트랩·ESC, 폼 검증, reduced-motion 대응.
- [ ] Desktop/Tablet/Mobile 레이아웃 정상.

## 12. Handoff
- 본 스펙의 F-ID·모듈 구조를 그대로 참조하는 **Claude Code 빌드 프롬프트**로 전환. Phase 순서(PRD §X): 스캐폴딩 → MVP 정적 → 인터랙션 → 품질 → 배포. 각 단계 종료 시 확정 원본과 시각 대조.

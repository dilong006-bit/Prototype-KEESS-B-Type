# KEESS B안 — KG에듀원 기업교육 통합 사이트

Next.js(App Router) + React + TypeScript + Tailwind v3.4 기반 **B안 5페이지 정적 사이트**.
디자인 기준: [`ref/design/Design.md`](ref/design/Design.md) · 확정 프로토타입([`ref/prototype`](ref/prototype)).

## 라우트

| 경로 | 페이지 | 틴트 | 원본 |
|---|---|---|---|
| `/` | 홈 (히어로 캐러셀·4필러·성과·FAQ·문의) | 중립 | `keess_home_C_v18` |
| `/ax-ai` | P1 AX·AI 전환 | 보라 `.tint-p1` | `keess_P1_AXAI_D_scenario_v7` |
| `/leadership` | P2 리더십·조직 | 마젠타 `.tint-p2` | `keess_P2_leadership_B_framework` |
| `/hrd` | P3 HRD 통합 솔루션 (+정부지원 `#gov`) | 바이올렛 `.tint-p3` | `keess_P3_hrd_B_platform_v2.0` |
| `/content` | P4 콘텐츠 솔루션 (+대표과정 조회 `#featured`·다운로드 `#download`) | 웜 `.tint-p4` | `keess_P4_content_solution_B_v2.0` |

- **부정훈련 예방/신고 모달**: 공통 Footer에 상시 마운트 → 전 페이지 동작(기준 = `KEESS_home_C_v26`).
- **크로스링크**: `/hrd#gov` ↔ `/content#download`.
- **다운로드**: `public/downloads/KG에듀원_과정리스트.xlsx` (라이트 게이트 → 실제 다운로드).

## 개발 · 빌드

```bash
npm install
npm run dev      # http://localhost:3001  (B안 로컬 컨벤션: 3000=A안, 3001=B안)
npm run build    # 정적 빌드 (SSG)
npm run start    # 빌드 결과 서빙 (http://localhost:3001)
```

> Windows에서 `next build` 후 `next dev`로 전환 시 `.next` 캐시 충돌이 나면 `.next`를 삭제하고 다시 실행하세요.

## 배포 (Vercel 권장)

1. 저장소를 Vercel에 연결 → 프레임워크 자동 감지(Next.js).
2. 빌드 커맨드 `next build`, 출력 자동. 환경변수 없음.
3. 전 페이지 정적(SSG)이므로 정적 호스팅(Netlify/S3+CloudFront 등)도 가능.

## 백엔드 없음 (연동 슬롯)

- 문의/상담/가이드/다운로드 게이트·부정훈련 신고는 **클라이언트 검증 + 성공/데모 상태 UI**입니다.
- 실전송은 각 폼의 `onSuccess`/submit 지점에 향후 엔드포인트(사내 API·메일 서비스)를 연결하면 됩니다.

## 구조

```
app/            # 라우트 + globals.css + layout(폰트·공통 Footer·ToTop)
components/
  common/       # Nav·Footer·ReportModal·Modal·SubNav·Button·Reveal 등
  sections/     # 페이지별 섹션(home/axai/leadership/hrd/content)
data/           # 카피·데이터(verbatim)
lib/            # useReveal·useModal·types
styles/         # components.css(공통) + 페이지별(home/axai/leadership/hrd/content).css
public/         # fonts(Pretendard self-host)·images·downloads(xlsx)
```

폰트: **Pretendard Variable self-host**(`next/font/local`) 전 페이지 통일 + Gowun Batang(홈 매니페스토 한정).

---

## 작업 이력 (Changelog)

### 1) 초기 빌드
- 스캐폴딩(Next 14·Tailwind v3.4·Pretendard self-host·디자인 토큰·5 라우트) → 공통 셸(Nav/Footer/Modal/SubNav) → 페이지 조립(홈 → P1 → P2 → P3 → P4).
- 부정훈련 예방/신고 모달을 `KEESS_home_C_v26` 기준으로 동기화(3탭·필수 5필드·id 분리·전화 자동 하이픈·조회).
- B안 특화: P3 정부지원 환급(`#gov`, 문의 프리셀렉트) · P4 다운로드 라이트 게이트(실제 xlsx) · 크로스링크(`/hrd#gov` ↔ `/content#download`).

### 2) QA · 리팩토링 · 배포 준비
- 시니어 QA 접근성 패스(skip link·모바일 메뉴 탭트랩·폼 라벨 연결 등) → 5페이지 DoD 통과.
- 공통 유틸 추출(`lib/utils`: EMAIL_RE·scrollToId·prefersReducedMotion), dead code 제거(`LeadForm`).
- 리포지토리 위생(로컬 툴링·중복 대용량 에셋 제외) 후 GitHub 초기 푸시.

### 3) UI/UX 고도화 (기술명세서·분석전략서 반영)
- **공통**: 히어로 높이 통일(88vh) · 카피 내 em-dash → 쉼표/문장분리 · 법조문 `§` → `제N조` · 내부 주석 괄호문구 제거.
- **P1 AX·AI**: 히어로 우측 실사(지구 야경) · bento 정합(학습 카드·통계 풀폭) · 과정 라인업 실사·실제 과정명 · 시나리오 버튼/칩 · 포지셔닝맵 노드 맥동 모션 · 성과 GAP 박스 풀폭.
- **P2 리더십**: 조직진단 레이더 흰 카드(가독성) · 도입문의 폼 열 정렬 · STAGE 칩 여백 · 진단 CTA 사이즈.
- **P3 HRD**: 정부지원 상담 버튼 사이즈 · 한 줄/대시 정리.
- **P4 콘텐츠**: 히어로 벤토 리디자인 · 프로토타입 패리티(직무 개별 아이콘·연결형 타임라인·파이프라인 화살표·실사 스튜디오) · IT카드 등높이·축 명료화·아이콘 정비.
- **P4 '대표 과정 조회' 재설계**: 6기능분류/34선 → **3필러(AX·AI/직무특화/비즈니스 스킬) × 6 = 18 대표과정**. 페이지 섹션 `#featured` + 모달이 동일 렌더 엔진 공유, 필터 드롭다운 제거·검색/탭 중심, 필러 포인트색(카드 1색). (대표과정조회 기술명세서 F1~F13)

### 4) 배포 후 개선 (라이브 피드백 반영)
- **P4 문구 정련**: 직무 섹션 헤드(직무별 필요한 교육을, 한눈에) · 대표과정 헤드(가장 먼저 살펴봐야 할 대표 과정) · 최종 CTA(우리 조직에 맞는 교육을, 함께 설계합니다).
- **앵커 스크롤 오프셋 수정**: `fixed` nav(72px)+`sticky` subnav(52px)에 가려 앵커 이동 시 콘텐츠가 상단에 붙던 문제 → `html{scroll-padding-top:130px}`로 전역 해결(섹션 고유 패딩 유지한 채 포커스 이동).
- **em-dash(`—`) 전역 제거**: 남은 카피(P3 문의 리드·아키텍처/환급 카드·P4 대표과정 제목 6건) → 쉼표. 사이트 전역 대시 미사용 원칙 확정.
- **앵커 포커싱 정밀화**: `scroll-padding-top`을 반응형(PC 35px / MOB 81px)으로 조정 → 정부지원 등 앵커 이동 시 섹션 eyebrow가 subnav 하단 ~30px에 프레이밍(콘텐츠 상단 붙음·상단 다크선 노출 동시 해소).
- **카피 정련**: P3 도입문의 리드 2행(조직 과제 진단 → 교육·운영·시스템 연결) · P2 WHY KG 타이틀(이번 교육이, 다음 리더를 만듭니다).
- **P4 다운로드 카피**: 헤드라인(원하는 과정을 / 전체 리스트에서 바로 찾아보세요) · 설명 · 크로스링크 버튼(정부지원 환급 안내).
- **모달 닫기 버튼 고도화(전 모달 공통)**: `×` 글리프 → 스트로크 SVG X로 교체(hover 시 광학 중심 정확) · 고정 top-right 앵커로 1행/2행 헤더 무관 제목 첫 줄 정렬(오차 ±2px) · outline 원형 + ink hover·scale·active·focus-visible 링. 게이트 모달 `.ctx` 웜(P4) 톤·업퍼케이스 마이크로 이브로우·입력 포커스 링 추가.
- **P1~P4 히어로 실사 이미지 통일**: 필러별 히어로에 실사 배경(저채도 텍스처) + 필러 톤 스크림의 동일 처리 적용 → 4페이지 히어로 시각 언어 통일. P1(디지털 워크플레이스)·P4(콘텐츠 제작)에 신규 실사 추가, P2(팀)·P3(시스템)는 기존 이미지 유지. **Unsplash 소싱 후 `public/images/p1~p4-hero.jpg`로 self-host**(핫링크 제거·배포 견고성). 콘텐츠(카드·copy)는 불변, 배경 레이어만 추가(§0.5-3 스크림/그라데이션 허용 영역).
- **히어로 eyebrow 칩 통일**: 4페이지 히어로 eyebrow를 동일한 글래스 필 칩(닷 + `blur(8px)` + border + 8·15 pad + 22px margin)으로 정규화. P4는 평문 이브로우 → 칩 전환(닷 추가), P1 태그는 `End-to-End Partner`로 축약, P2/P3는 blur·margin 미세 편차 정합. 구성 불변·시각 통일.

> 백엔드 미연동(클라이언트 상태 UI) · Design.md 토큰 준수 · 가격/결제 요소 없음.

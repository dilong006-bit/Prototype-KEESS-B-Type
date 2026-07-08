# Claude Code 전달용 프롬프트 — KEESS B안 최종 빌드

> 사용법: VSCode에서 `KEESS_B-Type` 폴더를 열고 Claude Code에 아래 블록을 그대로 붙여넣으세요.
> 이 폴더에는 `CLAUDE.md`(빌드 규칙, 자동 로드)와 `ref/`(design/Design.md · prd/PRD · spec/TECHSPEC · prototype 5종)가 이미 있습니다.

---

너는 KEESS 프로젝트의 프론트엔드 엔지니어다. `KEESS_B-Type` 폴더에서 **KEESS B안 5페이지 사이트**를 Next.js로 빌드한다. 백엔드 없는 정적 사이트지만 **즉시 상용화 가능한 완성도**로 만든다.

## 0. 시작 전 반드시 읽을 것 (순서대로)
1. `CLAUDE.md` — 빌드·코딩 절대 규칙(토큰·폰트·틴트·라우트·B안 특화·DoD).
2. `ref/design/Design.md` — 디자인 헌법(토큰/컴포넌트/모션/보이스).
3. `ref/prd/PRD_KEESS_B_v1.0.md` — 기능 F1~F18(우선순위·수용조건).
4. `ref/spec/TECHSPEC_KEESS_B_v1.0.md` — 아키텍처·컴포넌트 계약·데이터 스키마·인터랙션 로직·배포. **구현은 이 문서를 따른다.**
5. `ref/prototype/*.html` — 확정 원본 5종(레이아웃·섹션·카피의 source of truth):
   - 홈 `keess_home_C_v18_최종확정(260703).html`
   - P1 `keess_P1_AXAI_D_scenario_v7.html`
   - P2 `keess_P2_leadership_B_framework_v1.0.html`
   - P3 `keess_P3_hrd_B_platform_v2.0.html`
   - P4 `keess_P4_content_solution_B_v2.0.html`
   - (와이어프레임 2종·정부지원/다운로드 SPEC은 보조 참조)

읽은 뒤 **구현 전에** 1~7단계 실행 계획을 3~6줄로 요약해 내 확인을 받아라. 애매하거나 원본이 충돌하면 임의로 정하지 말고 질문하라.

## 1. 절대 원칙 (CLAUDE.md 준수)
- 새 UX·IA·컬러·폰트·컴포넌트·그림자·라운드·브레이크포인트 **발명 금지**. 원본·Design.md에 있는 것만 이식.
- 토큰 1:1(`var(--*)`/Tailwind), 카피는 원본 그대로, P1(D)은 구성 변경 금지.
- **하나의 사이트 = 일관 디자인**. 필러는 틴트 토큰(4값)으로만.
- 백엔드 없음: 폼·다운로드는 상태 UI + 정적 자산.
- 충돌 시 우선순위: 홈 > 코퍼레이트 > P1~P4. **단 §1.5 6대 원칙이 최우선.** 애매하면 질문.

## 1.5 ★ B안 필수 준수 6대 원칙 (Design.md §0.5 · A안 이슈 재발 방지 · 최우선)
1. **GNB = 실제 페이지 라우팅**: 상단 메뉴 클릭 시 각 페이지 이동(`/ax-ai`·`/leadership`·`/hrd`·`/content`, 정부지원=`/hrd#gov`). Next `<Link>`, 현재 페이지 `aria-current="page"`. **무동작·placeholder 링크 금지.**
2. **좌측 상단 KEESS 로고 = 홈(`/`).**
3. **그라데이션 = 원래 있던 영역이면 톤 정합 허용**: 확정 프로토타입이 이미 그라데이션 쓰던 영역(히어로 배경·미디어 스크림·강조 CTA·데이터 시각화)만 `--p1~--p4`·`--ink` 파생 톤 정합 그라데이션 허용. 신규 다색 그라데이션 발명·대형 텍스트 배경 채색 금지.
4. **인터랙션 고도화 허용**: 구성·카피 불변, 모션 토큰 내 hover/focus/전환/스크롤 스파이 등 체감 향상 가능. reduced-motion 유지.
5. **푸터 = 전 페이지 공통**(홈 다크 Footer, 부정훈련 예방/신고 포함).
6. **'교육 상담' CTA = 최상의 UI/UX로 "누르고 싶게"**: 고대비 pill+아이콘·hover 상승·톤 정합 그라데이션. 1차 CTA는 하나, 전환은 상담/진단/가이드/다운로드 수렴, 터치 44px+·포커스 링.
> ★★ **홈 Footer '부정훈련 예방 안내'·'부정훈련 신고'는 홈 빌드 범위에서 절대 누락 금지**(A안 누락 사례). 3탭 모달(예방/신고 접수/신고 조회) 원본 그대로 이식·동작.

## 2. ★ 폰트 일관성 (핵심)
- **전 페이지 Pretendard Variable을 `next/font/local`로 self-host**(`public/fonts/PretendardVariable.woff2`, weight `45 920`, `--font-pretendard`). `app/layout.tsx`에서 `<html>`에 적용 → 전 페이지 상속.
- **원본 정규화**: P2 B·P3 B의 `"Pretendard"/맑은 고딕` 폴백과 홈·P1·P4의 CDN 링크를 **그대로 옮기지 말 것**. 전부 self-host Pretendard Variable 하나로 통일한다.
- serif(Gowun Batang)는 `next/font/google`로 로드하되 **홈 매니페스토 등 확정 홈의 선언형 문구에만** 사용. 필러 페이지는 Pretendard 단일. 신규 서체 금지.
- Pretendard woff2 확보: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2` 다운로드해 `public/fonts/`에 배치(무결성: 매직바이트 `wOF2`).

## 3. 기술 스택 · 셋업 (TECHSPEC §1~3)
- Next.js(**App Router**) + React + TypeScript + **Tailwind v3.4 고정**(`tailwind.config.ts` 토큰 매핑; create-next-app이 v4를 넣으면 v3.4 + postcss + autoprefixer로 교체).
- `globals.css :root`에 Design.md 토큰 전량 + 필러 틴트 4클래스(`.tint-p1~p4`) + `--gov`.
- `tailwind.config.ts`: 색·간격·라운드·그림자·폰트·검증 브레이크포인트(1040~560) 매핑. 신규 값 0.
- **비어있지 않은 폴더 주의**: `CLAUDE.md`·`ref/`·`.claude/`(있으면)는 절대 덮어쓰지 말고 보존(임시 폴더 생성 후 병합).
- 다운로드 자산: `ref/prototype/KG에듀원_과정리스트.xlsx`를 `public/downloads/`로 복사(무공백 파일명 유지).
- 이미지: 원본의 Unsplash URL은 그대로 두고 `onerror` 폴백. 브랜드 이미지 신규 생성 금지.
- `git init` + `.gitignore` 선행.

## 4. 라우트 · 폴더 (TECHSPEC §2·§4)
- `/`(홈) · `/ax-ai`(P1) · `/leadership`(P2·`.tint-p2`) · `/hrd`(P3·`.tint-p3`) · `/content`(P4·`.tint-p4`).
- `app/`, `components/common`·`components/sections`, `data/`, `lib/`, `public/` 구조.
- 컴포넌트 계약·데이터 스키마는 TECHSPEC §5·§6 그대로(props 주입형, 카피는 `data/*.ts`).

## 5. 작업 순서 (단계별로, 각 단계 후 멈추고 확인)
1. **git init + 스캐폴딩** — Next(App Router)+TS+Tailwind v3.4, 토큰/틴트/폰트(self-host) 세팅, 빈 5라우트 `npm run dev` 무오류. (CLAUDE.md는 이미 있음)
2. **공통 컴포넌트 + 훅** — TECHSPEC §5 목록(Nav·Footer·SubNav·Section·SectionHeader·Button·Card·MetricStat·Modal·LeadForm·Reveal 등) + `useReveal(th .16)`·`useModal`(포커스 트랩·ESC).
3. **페이지 조립** — 홈 → /ax-ai → /leadership → /hrd → /content 순. 각 페이지 착수 시 해당 `ref/prototype` 원본을 정독해 마크업·카피 1:1 이식, `data/*.ts` 분리. **홈 조립 시 Footer 부정훈련 예방/신고 3탭 모달을 반드시 함께 구현(누락 0).** GNB 라우팅·로고 홈·공통 Footer·교육 상담 CTA(§1.5) 적용. **완성 직후 `full-page-screenshot`로 원본과 시각 대조.**
4. **B안 특화** — P3 `#gov`(정부지원, 문의 프리셀렉트)·P4 `#download`(라이트 게이트→xlsx)·P3↔P4 크로스링크(F7·F9·F13). 원본 v2.0에 이미 구현돼 있으니 동작 보존.
5. **인터랙션·반응형·접근성** — CTA/앵커·모달·탐색기(F11)·KGESA 데모(F16)·스크롤스파이·3디바이스·시맨틱·포커스·`prefers-reduced-motion`.
6. **자체 검증** — 5경로 원본 시각 대조 + DoD 체크. 에러 시 `root-cause-tracing`.
7. **배포 준비** — `next build` 무오류, 정적 배포(Vercel) 가이드. `git-pushing`로 의미 단위 커밋.

## 6. 설치된 스킬 활용 (있으면)
- `full-page-screenshot`/`playwright-skill`(원본 대조·동작 검증), `root-cause-tracing`(디버깅), `git-pushing`·`using-git-worktrees`(커밋·격리).
- 참고: 스킬이 A타입 프로젝트 스코프에만 있으면 이 폴더에서 안 보일 수 있다. 필요 시 개인 스코프 설치 또는 재설치를 나에게 확인.

## 7. 완료 기준 (Definition of Done · PRD/TECHSPEC)
- `next build` 무오류, 5경로 정적 구동.
- 확정 원본과 섹션 순서·카피 일치, 신규 색·서체 토큰 0.
- **폰트 5페이지 통일**(Pretendard Variable self-host, CDN·Malgun 잔재 0, serif 홈 한정).
- P3 정부지원 프리셀렉트·P4 다운로드 게이트·크로스링크 동작.
- Desktop/Tablet/Mobile 정상, 키보드 포커스·모달 트랩·reduced-motion 대응.
- 각 페이지 스크린샷을 `ref/prototype` 원본과 대조해 레이아웃 일치.

## 8. 작업 태도
- 원본 우선, 추측 금지, 애매하면 먼저 질문. 지시 범위만 수술적으로 구현. 큰 결정·구조 변경 전 짧게 근거 보고 후 확인. 각 단계 끝에서 멈춘다.

먼저 0번 문서를 읽고 1~7단계 실행 계획을 요약해 제시하라. 승인하면 1단계(git init + 스캐폴딩)부터 시작한다.

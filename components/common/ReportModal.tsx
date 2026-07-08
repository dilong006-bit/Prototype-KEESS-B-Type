'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useModal } from '@/lib/useModal';
import { REPORT_SEED, REPORT_STATUS, type ReportRecord } from '@/data/report';

// 세션 내 신규 접수 유지 (원본 window.__keessReports 대응)
const reports: ReportRecord[] = [...REPORT_SEED];

type Tab = 'info' | 'report' | 'lookup';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digits = (s: string) => (s || '').replace(/\D/g, '');
function genNo() {
  const d = new Date();
  const p = (x: number) => ('0' + x).slice(-2);
  const r = ('000' + Math.floor(Math.random() * 9000 + 1000)).slice(-4);
  return 'KR-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
}
function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}

// ── 아이콘 ────────────────────────────────────────────────────────────────
const IcShield = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.6-3.1 8.2-7 10-3.9-1.8-7-5.4-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>
);
const IcReport = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4"/><path d="M5 4h11l-1.6 4L16 12H5"/></svg>
);
const IcSearch = () => (
  <svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.2-4.2"/></svg>
);

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

export default function ReportModal({ open, onClose, initialTab = 'info' }: ReportModalProps) {
  const overlayRef = useModal(open, onClose);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [tab, setTabState] = useState<Tab>(initialTab);

  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab, setTab]);

  // ── 신고 접수 폼 상태 ──
  const emptyForm = {
    name: '', phone: '', pw: '', pw2: '', email: '', role: '',
    ttype: '', course: '', org: '', target: '', title: '', content: '',
  };
  const [form, setForm] = useState({ ...emptyForm });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [consentOpen, setConsentOpen] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [receiptNo, setReceiptNo] = useState('—');

  const upd = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submitReport() {
    const reqs: (keyof typeof emptyForm)[] = ['name', 'phone', 'pw', 'pw2', 'email', 'role', 'course', 'org', 'title', 'content'];
    const next: Record<string, boolean> = {};
    let ok = true;
    reqs.forEach((id) => {
      const bad = !(form[id] || '').trim();
      next[id] = bad;
      if (bad) ok = false;
    });
    const eok = emailRe.test((form.email || '').trim());
    next.email = !eok;
    if (!eok) ok = false;
    if (form.pw && form.pw2 && form.pw !== form.pw2) {
      next.pw2 = true;
      ok = false;
    }
    const c1bad = !agree1, c2bad = !agree2;
    next.__c1 = c1bad;
    next.__c2 = c2bad;
    if (c1bad || c2bad) ok = false;
    setErrs(next);
    if (!ok) {
      const first = bodyRef.current?.querySelector('.field.invalid, .consent.invalid');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const no = genNo();
    reports.push({
      no, name: form.name.trim(), phone: form.phone.trim(), pw: form.pw,
      title: form.title.trim(), content: form.content.trim(), status: 0, date: todayStr(),
    });
    setReceiptNo(no);
    setDone(true);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }

  // ── 조회 상태 ──
  const [lkName, setLkName] = useState('');
  const [lkPhone, setLkPhone] = useState('');
  const [lkErr, setLkErr] = useState<{ name?: boolean; phone?: boolean }>({});
  const [lkRecs, setLkRecs] = useState<ReportRecord[] | null>(null);
  const [lkNotFound, setLkNotFound] = useState(false);
  // 카드별 상세 상태
  const [cardOpen, setCardOpen] = useState<Record<number, boolean>>({});
  const [cardPw, setCardPw] = useState<Record<number, string>>({});
  const [cardPwErr, setCardPwErr] = useState<Record<number, string>>({});
  const [cardRevealed, setCardRevealed] = useState<Record<number, boolean>>({});

  function doLookup() {
    const name = lkName.trim();
    const phone = digits(lkPhone);
    const e: { name?: boolean; phone?: boolean } = { name: !name, phone: !phone };
    setLkErr(e);
    if (!name || !phone) return;
    const recs = reports.filter((r) => r.name === name && digits(r.phone) === phone);
    if (!recs.length) {
      setLkNotFound(true);
      setLkRecs(null);
      return;
    }
    setLkNotFound(false);
    setLkRecs(recs);
    setCardOpen({});
    setCardPw({});
    setCardPwErr({});
    setCardRevealed({});
  }

  function lookupBack() {
    setLkRecs(null);
    setLkNotFound(false);
  }

  function verifyCard(i: number, rec: ReportRecord) {
    if ((cardPw[i] || '') !== rec.pw) {
      setCardPwErr((s) => ({ ...s, [i]: '비밀번호가 일치하지 않습니다.' }));
      return;
    }
    setCardPwErr((s) => ({ ...s, [i]: '' }));
    setCardRevealed((s) => ({ ...s, [i]: true }));
  }

  function fromDoneToLookup() {
    setTab('lookup');
    setLkName(form.name.trim());
    setLkPhone(form.phone.trim());
  }

  const fld = (k: keyof typeof emptyForm) => `field${errs[k] ? ' invalid' : ''}`;

  return (
    <div
      className={`pv-overlay${open ? ' open' : ''}`}
      id="prevent-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pv-title"
      aria-hidden={!open}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pv-dialog" ref={overlayRef}>
        <div className="pv-head">
          <h3 id="pv-title">부정훈련 예방 및 신고</h3>
          <button className="pv-close" type="button" aria-label="닫기" onClick={onClose} data-autofocus>&times;</button>
        </div>
        <div className="pv-tabs" role="tablist">
          <button className={`pv-tab${tab === 'info' ? ' on' : ''}`} type="button" role="tab" aria-selected={tab === 'info'} onClick={() => setTab('info')}><IcShield />예방 안내</button>
          <button className={`pv-tab${tab === 'report' ? ' on' : ''}`} type="button" role="tab" aria-selected={tab === 'report'} onClick={() => setTab('report')}><IcReport />신고 접수</button>
          <button className={`pv-tab${tab === 'lookup' ? ' on' : ''}`} type="button" role="tab" aria-selected={tab === 'lookup'} onClick={() => setTab('lookup')}><IcSearch />신고 조회</button>
        </div>

        <div className="pv-body" ref={bodyRef}>
          {/* ── 예방 안내 ── */}
          <div className={`pv-pane${tab === 'info' ? ' on' : ''}`} id="pv-pane-info">
            <p className="pv-lead">KG에듀원은 부정훈련을 철저히 관리합니다. 부정훈련이 적발되면 진도율·평가점수와 관계없이 미수료 처리되며, 고용보험상의 정부지원을 받을 수 없습니다.</p>
            <h4 className="pv-h"><svg className="pvi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>부정훈련이란?</h4>
            <p>「국민 평생 직업능력 개발법」에 따른 직업능력개발훈련을 법과 규정을 벗어난 방법으로 실시하는 것을 말합니다. 대표적으로 훈련생이 아닌 타인의 대리 수강·평가, 훈련비 지원금 리베이트 거래, 승인 내용과 다르게 운영하는 훈련내용 미준수 등이 있습니다.</p>
            <p className="pv-warn"><svg className="pvi-warn" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 4.3 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg><span>적발 시 훈련기관·기업·개인은 훈련비 지원금 징수(부정수급액 최대 5배)와 지원 제한 등 행정처분 및 형사처벌을 받을 수 있습니다.</span></p>
            <h4 className="pv-h"><svg className="pvi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.6-3.1 8.2-7 10-3.9-1.8-7-5.4-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>본인 수강 확인</h4>
            <table className="pv-table"><thead><tr><th>학습 단계</th><th>본인 확인 방식</th></tr></thead><tbody>
              <tr><td>최초 로그인</td><td>휴대폰 · I-PIN</td></tr>
              <tr><td>과정 입과 시 최초 1회</td><td>mOTP · 공동인증서 · 휴대폰 · I-PIN</td></tr>
              <tr><td>1일 1회 진도 학습 · 평가 · 과제</td><td>mOTP · 휴대폰 · I-PIN</td></tr>
            </tbody></table>
            <h4 className="pv-h"><svg className="pvi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.2-4.2"/></svg>부정훈련 적발 기준</h4>
            <ul className="pv-list">
              <li>연속된 시간에 동일 IP·PC 정보에서 평가를 제출한 경우</li>
              <li>접속자의 FDS 정보가 동일한 경우</li>
              <li>사업자 정보가 다르지만 동일 IP에서 수강·평가한 경우</li>
            </ul>
            <p className="pv-note">위 항목 중 하나라도 해당하면 부정훈련 검출 프로그램을 통해 절차를 진행합니다.</p>
            <h4 className="pv-h"><svg className="pvi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>KG에듀원의 부정훈련 방지 약속</h4>
            <ul className="pv-list">
              <li>훈련생의 진도·평가를 담당자나 외부 인원이 대신 수행하지 않습니다.</li>
              <li>수료 기준에 미달한 훈련생을 임의로 수료 처리하지 않습니다.</li>
              <li>승인받은 콘텐츠·교재와 평가문항으로 진행하며, 평가 전 모범답안을 제공하지 않습니다.</li>
              <li>경력·학력이 인증된 자격 있는 교·강사가 역할을 수행합니다.</li>
              <li>수강을 강요하지 않으며, 대리수강·모사답안 방지를 위해 상시 모니터링합니다.</li>
            </ul>
            <div className="pv-cta">
              <div><b>부정훈련을 발견하셨나요?</b></div>
              <button className="btn btn-ink" type="button" onClick={() => setTab('report')}><IcReport />부정훈련 신고하기</button>
            </div>
          </div>

          {/* ── 신고 접수 ── */}
          <div className={`pv-pane${tab === 'report' ? ' on' : ''}`} id="pv-pane-report">
            {!done ? (
              <>
                <div className="pv-toplink"><button type="button" className="pv-link" onClick={() => setTab('lookup')}><IcSearch />이미 신고하셨나요? 신고 조회하기</button></div>
                <p className="pv-lead">KG에듀원은 부정·부실훈련을 줄이고 올바른 훈련문화를 만들기 위해 노력합니다. 아래로 신고 내용을 남겨 주시면 접수·처리되며, 입력하신 정보는 비공개로 처리됩니다.</p>

                <div className="pv-fs">
                  <div className="pv-fs-head"><span className="pv-fs-t"><svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>신고자 정보</span><span className="pv-fs-d">입력 정보는 비공개 처리됩니다</span></div>
                  <div className="pv-frow">
                    <div className={fld('name')}><label>성함 <span className="req">*</span></label><input type="text" value={form.name} onChange={upd('name')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                    <div className={fld('phone')}><label>전화번호 <span className="req">*</span></label><input type="tel" placeholder="010-0000-0000" value={form.phone} onChange={upd('phone')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                  </div>
                  <div className="pv-frow">
                    <div className={fld('pw')}><label>접수 비밀번호 <span className="req">*</span></label><input type="password" value={form.pw} onChange={upd('pw')} /><span className="fnote">상세 조회 시 사용됩니다</span><span className="err">필수 항목을 확인해 주세요.</span></div>
                    <div className={fld('pw2')}><label>비밀번호 확인 <span className="req">*</span></label><input type="password" value={form.pw2} onChange={upd('pw2')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                  </div>
                  <div className="pv-frow">
                    <div className={fld('email')}><label>이메일 <span className="req">*</span></label><input type="email" placeholder="name@company.com" value={form.email} onChange={upd('email')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                    <div className={fld('role')}><label>신고자 신분 <span className="req">*</span></label><div className="sel"><select value={form.role} onChange={upd('role')}><option value="">선택</option><option>훈련생</option><option>훈련강사</option><option>훈련기관 관계자</option><option>기업 관계자</option><option>기타</option></select></div><span className="err">필수 항목을 확인해 주세요.</span></div>
                  </div>
                </div>

                <div className="pv-fs">
                  <span className="pv-fs-t"><svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h13a1 1 0 0 1 1 1v15H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z"/><path d="M5 17h14"/></svg>훈련 정보</span>
                  <div className="pv-frow">
                    <div className="field"><label>훈련 구분</label><div className="sel"><select value={form.ttype} onChange={upd('ttype')}><option value="">선택</option><option>사업주훈련</option><option>디지털아카이브</option><option>기업훈련카드</option><option>국민내일배움카드</option><option>기타</option></select></div></div>
                    <div className={fld('course')}><label>훈련 과정명 <span className="req">*</span></label><input type="text" value={form.course} onChange={upd('course')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                  </div>
                  <div className={fld('org')}><label>훈련 기관 <span className="req">*</span></label><input type="text" value={form.org} onChange={upd('org')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                </div>

                <div className="pv-fs">
                  <span className="pv-fs-t"><svg className="pvi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h8"/><path d="M16.5 3.5a2 2 0 0 1 3 3L8 18l-4 1 1-4z"/></svg>신고 내용</span>
                  <div className="field"><label>신고 대상</label><div className="sel"><select value={form.target} onChange={upd('target')}><option value="">선택</option><option>훈련생</option><option>훈련강사</option><option>훈련내용</option><option>기타</option></select></div></div>
                  <div className={fld('title')}><label>제목 <span className="req">*</span></label><input type="text" value={form.title} onChange={upd('title')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                  <div className={fld('content')}><label>내용 <span className="req">*</span></label><textarea rows={4} placeholder="신고 내용을 구체적으로 작성해 주세요." value={form.content} onChange={upd('content')} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                </div>

                <div className="consent-group" style={{ marginTop: 8 }}>
                  <div className={`consent${!agree1 && errs.__c1 ? ' invalid' : ''}`}>
                    <label className="consent-main"><input type="checkbox" checked={agree1} onChange={(e) => setAgree1(e.target.checked)} /><span><b className="c-tag req-tag">필수</b> 개인정보 수집·이용 안내</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, p1: !s.p1 }))}>{consentOpen.p1 ? '접기' : '전문 보기'}</button>
                  </div>
                  <div className="consent-text" style={{ maxHeight: consentOpen.p1 ? 240 : 0 }}><div className="ct-inner"><p><b>개인정보 수집·이용 안내 (필수)</b></p><p>부정훈련 신고센터를 통해 신고 접수 시 아래와 같이 개인정보를 수집·이용합니다.</p><p><b>수집 항목</b><br />(필수) 신고자의 성명, 휴대폰번호, 이메일, 신고자 신분</p><p><b>수집·이용 목적</b><br />신고의 접수·처리 등 소관 업무 수행</p><p><b>보유·이용 기간</b><br />신고 접수와 관련해 수집한 개인정보는 10년간 기록·보존되며, 기간 경과 시 관련 법령에 따라 파기합니다.</p></div></div>
                  <div className={`consent${!agree2 && errs.__c2 ? ' invalid' : ''}`}>
                    <label className="consent-main"><input type="checkbox" checked={agree2} onChange={(e) => setAgree2(e.target.checked)} /><span><b className="c-tag req-tag">필수</b> 개인정보 제3자 제공</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, p2: !s.p2 }))}>{consentOpen.p2 ? '접기' : '전문 보기'}</button>
                  </div>
                  <div className="consent-text" style={{ maxHeight: consentOpen.p2 ? 240 : 0 }}><div className="ct-inner"><p><b>개인정보의 제3자 제공 (필수)</b></p><p><b>제공받는 기관</b><br />훈련기관 주소 기준 관할 고용복지플러스센터, 고용노동부</p><p><b>제공 목적</b><br />부정훈련 신고사항 검토 및 지도점검 등 훈련품질관리 업무</p><p><b>제공 항목</b><br />신고자의 성명, 휴대폰번호, 신고자 신분</p><p><b>보유·이용 기간</b><br />관련 법령에 따라 10년간 기록·보존되며, 기간 경과 시 파기합니다.</p></div></div>
                </div>
                <button className="btn btn-ink" type="button" style={{ width: '100%', marginTop: 20 }} onClick={submitReport}>신고 접수</button>
              </>
            ) : (
              <div className="pv-done show">
                <div className="check"><svg className="pvi-done" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg></div>
                <h4>신고가 접수되었습니다.</h4>
                <p>담당자가 확인 후 절차를 진행합니다. 접수 시 입력하신 이름·연락처로 신고 내역을 조회하실 수 있습니다.</p>
                <div className="pv-receipt"><span>접수번호</span><b>{receiptNo}</b></div>
                <p className="pv-receipt-note">이름·연락처로 목록을 조회하고, 상세 내용은 이 신고의 비밀번호로 확인합니다.</p>
                <div className="pv-done-cta">
                  <button className="btn btn-ink" type="button" onClick={fromDoneToLookup}><IcSearch />신고 조회하기</button>
                  <button className="btn-line-dark" type="button" onClick={onClose}>닫기</button>
                </div>
              </div>
            )}
          </div>

          {/* ── 신고 조회 ── */}
          <div className={`pv-pane${tab === 'lookup' ? ' on' : ''}`} id="pv-pane-lookup">
            <p className="pv-lead">접수 시 입력하신 <b>이름</b>과 <b>연락처</b>로 신고 내역을 조회하실 수 있습니다. 상세 내용은 신고마다 설정한 <b>비밀번호</b>로 확인합니다.</p>
            {!lkRecs ? (
              <>
                <div id="pv-lookup-form">
                  <div className="pv-fs"><div className="pv-frow">
                    <div className={`field${lkErr.name ? ' invalid' : ''}`}><label>이름 <span className="req">*</span></label><input type="text" placeholder="홍길동" value={lkName} onChange={(e) => setLkName(e.target.value)} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                    <div className={`field${lkErr.phone ? ' invalid' : ''}`}><label>연락처 <span className="req">*</span></label><input type="tel" placeholder="010-1234-5678" value={lkPhone} onChange={(e) => setLkPhone(e.target.value)} /><span className="err">필수 항목을 확인해 주세요.</span></div>
                  </div></div>
                  <button className="btn btn-ink" type="button" style={{ width: '100%', marginTop: 6 }} onClick={doLookup}>신고 내역 조회</button>
                </div>
                {lkNotFound && <div className="pv-notfound">일치하는 신고 내역이 없습니다. 접수 시 입력하신 이름·연락처를 다시 확인해 주세요.</div>}
              </>
            ) : (
              <div id="pv-lookup-result" aria-live="polite">
                <div className="pv-list-head"><span>총 <b>{lkRecs.length}</b>건의 신고 내역</span><button className="pv-link" type="button" onClick={lookupBack}>← 다시 조회</button></div>
                {lkRecs.map((r, i) => (
                  <div className="pv-rcard" key={r.no}>
                    <div className="pv-rc-top"><span className="pv-rc-no">{r.no}</span><span className={`pv-badge s${r.status}`}>{REPORT_STATUS[r.status]}</span></div>
                    <div className="pv-rc-title">{r.title}</div>
                    <div className="pv-rc-date">{r.date} 접수</div>
                    <button className="pv-rc-toggle" type="button" onClick={() => setCardOpen((s) => ({ ...s, [i]: !s[i] }))}>{cardOpen[i] ? '접기 ‹' : '상세 보기 ›'}</button>
                    <div className={`pv-rc-detail${cardOpen[i] ? ' open' : ''}`}>
                      {!cardRevealed[i] ? (
                        <div className="pv-rc-pw">
                          <label>이 신고의 비밀번호</label>
                          <div className="pv-rc-pwrow">
                            <input type="password" placeholder="접수 시 설정한 비밀번호" value={cardPw[i] || ''} onChange={(e) => setCardPw((s) => ({ ...s, [i]: e.target.value }))} />
                            <button className="btn-line-dark" type="button" onClick={() => verifyCard(i, r)}>확인</button>
                          </div>
                          <span className="pv-rc-err">{cardPwErr[i] || ''}</span>
                        </div>
                      ) : (
                        <div className="pv-rc-content">
                          <dl className="pv-dl"><dt>내용</dt><dd>{r.content}</dd></dl>
                          {r.status < 3 && (
                            <div className="pv-steps">
                              {['접수 완료', '검토 중', '처리 완료'].map((s, k) => (
                                <span key={s} style={{ display: 'contents' }}>
                                  <span className={`pv-step${k <= Math.min(r.status, 2) ? ' on' : ''}`}><span className="dot" />{s}</span>
                                  {k < 2 && <span className="pv-step-arrow">›</span>}
                                </span>
                              ))}
                            </div>
                          )}
                          {r.answer && <div className="pv-answer"><b>처리 결과</b><p>{r.answer}</p></div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

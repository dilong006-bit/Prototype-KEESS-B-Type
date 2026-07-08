'use client';

import { createContext, useContext, useState } from 'react';
import Modal from '@/components/common/Modal';
import { INQ_MODAL, GUIDE_MODAL } from '@/data/axai';

interface AxModalCtx {
  openInq: () => void;
  openGuide: () => void;
}
const Ctx = createContext<AxModalCtx>({ openInq: () => {}, openGuide: () => {} });
export const useAxModal = () => useContext(Ctx);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function InquiryBody({ onClose }: { onClose: () => void }) {
  const [v, setV] = useState({ sector: '', company: '', name: '', email: '', size: '', phone: '', msg: '' });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [interests, setInterests] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const upd = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  function submit() {
    const next: Record<string, boolean> = {};
    let ok = true;
    (['sector', 'company', 'name', 'size'] as const).forEach((k) => {
      const bad = !(v[k] || '').trim();
      next[k] = bad; if (bad) ok = false;
    });
    const eok = emailRe.test((v.email || '').trim());
    next.email = !eok; if (!eok) ok = false;
    setErrs(next);
    if (!ok) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className="form-done show">
        <div className="check">✓</div>
        <h4>{INQ_MODAL.successTitle}</h4>
        <p>{INQ_MODAL.successMsg}</p>
        <button className="btn-line-dark" type="button" style={{ marginTop: 20 }} onClick={onClose}>닫기</button>
      </div>
    );
  }
  const fld = (k: string) => `field${errs[k] ? ' invalid' : ''}`;
  return (
    <div>
      <p className="sec-sub" style={{ marginTop: 0, marginBottom: 6 }}>{INQ_MODAL.sub}</p>
      <div className={fld('sector')}><label>부문 <span className="req">*</span></label><select value={v.sector} onChange={upd('sector')}><option value="">선택</option>{INQ_MODAL.sectors.map((o) => <option key={o}>{o}</option>)}</select><span className="err">부문을 선택해 주세요.</span></div>
      <div className={fld('company')}><label>회사·기관명 <span className="req">*</span></label><input value={v.company} onChange={upd('company')} /><span className="err">회사·기관명을 입력해 주세요.</span></div>
      <div className={fld('name')}><label>담당자명 <span className="req">*</span></label><input value={v.name} onChange={upd('name')} /><span className="err">담당자명을 입력해 주세요.</span></div>
      <div className={fld('email')}><label>이메일 <span className="req">*</span></label><input type="email" value={v.email} onChange={upd('email')} /><span className="err">올바른 이메일을 입력해 주세요.</span></div>
      <div className={fld('size')}><label>교육 대상 규모 <span className="req">*</span></label><select value={v.size} onChange={upd('size')}><option value="">선택</option>{INQ_MODAL.sizes.map((o) => <option key={o}>{o}</option>)}</select><span className="err">규모를 선택해 주세요.</span></div>
      <div className="field"><label>관심 영역</label><div className="chips">{INQ_MODAL.interests.map((it) => (
        <span key={it} className={`mchip${interests[it] ? ' on' : ''}`} onClick={() => setInterests((s) => ({ ...s, [it]: !s[it] }))}>{it}</span>
      ))}</div></div>
      <div className="field"><label>연락처</label><input value={v.phone} onChange={upd('phone')} /></div>
      <div className="field"><label>문의 내용</label><textarea rows={3} value={v.msg} onChange={upd('msg')} /></div>
      <button className="btn btn-ink" type="button" style={{ width: '100%', marginTop: 18 }} onClick={submit}>상담 신청</button>
    </div>
  );
}

function GuideBody({ onClose }: { onClose: () => void }) {
  const [v, setV] = useState({ company: '', name: '', email: '' });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const [done, setDone] = useState(false);
  const upd = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  function submit() {
    const next: Record<string, boolean> = {};
    let ok = true;
    (['company', 'name'] as const).forEach((k) => { const bad = !(v[k] || '').trim(); next[k] = bad; if (bad) ok = false; });
    const eok = emailRe.test((v.email || '').trim());
    next.email = !eok; if (!eok) ok = false;
    setErrs(next);
    if (!consent) { setConsentErr(true); ok = false; } else setConsentErr(false);
    if (!ok) return;
    setDone(true);
  }

  if (done) {
    return (
      <div className="form-done show">
        <div className="check">✓</div>
        <h4>{GUIDE_MODAL.successTitle}</h4>
        <p>{GUIDE_MODAL.successMsg}</p>
        <button className="btn-line-dark" type="button" style={{ marginTop: 20 }} onClick={onClose}>닫기</button>
      </div>
    );
  }
  const fld = (k: string) => `field${errs[k] ? ' invalid' : ''}`;
  return (
    <div>
      <p className="sec-sub" style={{ marginTop: 0, marginBottom: 12 }}>{GUIDE_MODAL.sub}</p>
      <div className="pv-hint" style={{ marginTop: 0 }}><b>{GUIDE_MODAL.valueTitle}</b></div>
      <ul className="pv-list" style={{ marginTop: 0, marginBottom: 14 }}>
        {GUIDE_MODAL.value.map((x) => <li key={x}>{x}</li>)}
      </ul>
      <div className={fld('company')}><label>회사·기관명 <span className="req">*</span></label><input value={v.company} onChange={upd('company')} /><span className="err">회사·기관명을 입력해 주세요.</span></div>
      <div className={fld('name')}><label>담당자명 <span className="req">*</span></label><input value={v.name} onChange={upd('name')} /><span className="err">담당자명을 입력해 주세요.</span></div>
      <div className={fld('email')}><label>이메일 <span className="req">*</span></label><input type="email" value={v.email} onChange={upd('email')} /><span className="err">올바른 이메일을 입력해 주세요.</span></div>
      <div className="consent-group">
        <div className={`consent${consentErr ? ' invalid' : ''}`}>
          <label className="consent-main"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span><b className="c-tag req-tag">필수</b> {GUIDE_MODAL.consent}</span></label>
        </div>
      </div>
      <button className="btn btn-ink" type="button" style={{ width: '100%', marginTop: 18 }} onClick={submit}>가이드 받기</button>
    </div>
  );
}

export default function AxModalProvider({ children }: { children: React.ReactNode }) {
  const [inq, setInq] = useState(false);
  const [guide, setGuide] = useState(false);
  return (
    <Ctx.Provider value={{ openInq: () => setInq(true), openGuide: () => setGuide(true) }}>
      {children}
      <Modal open={inq} onClose={() => setInq(false)} labelledBy="ax-inq-title" title={INQ_MODAL.title} maxWidth={560}>
        <InquiryBody onClose={() => setInq(false)} />
      </Modal>
      <Modal open={guide} onClose={() => setGuide(false)} labelledBy="ax-guide-title" title={GUIDE_MODAL.title} maxWidth={520}>
        <GuideBody onClose={() => setGuide(false)} />
      </Modal>
    </Ctx.Provider>
  );
}

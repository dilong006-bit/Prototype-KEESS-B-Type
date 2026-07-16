'use client';

import { EMAIL_RE } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { INQ } from '@/data/home';

const ALLOWED = ['zip', 'pdf', 'hwp', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
const MAX = 10 * 1024 * 1024;
const FILE_PLACEHOLDER = '파일을 선택하거나 끌어다 놓으세요';

/** 상담 신청 제출 페이로드 — 기술명세서 §D-1 확정 스키마 (부문 키 없음 · 마케팅 3채널). */
export interface InquiryPayload {
  companyName: string;
  managerName: string;
  email: string;
  phone: string;
  eduScale: '' | 'under50' | '50to300' | '300to1000' | 'over1000';
  interests: string[];
  message: string;
  attachment: File | null;
  agreePrivacy: true;
  agreeMarketingEmail: boolean;
  agreeMarketingSms: boolean;
  agreeMarketingTel: boolean;
}

/** 백엔드 없음(CLAUDE.md §0-6) — 추후 사내 API·메일 서비스 엔드포인트를 여기에 연결한다. */
function submitInquiry(payload: InquiryPayload) {
  return Promise.resolve(payload);
}

export default function HomeInquiry() {
  const [v, setV] = useState({ company: '', name: '', email: '', phone: '', eduScale: '', message: '' });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [interests, setInterests] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [mkt, setMkt] = useState({ email: false, sms: false, tel: false });
  const [consentErr, setConsentErr] = useState(false);
  const [consentOpen, setConsentOpen] = useState<Record<string, boolean>>({});
  const [hp, setHp] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(FILE_PLACEHOLDER);
  const [fileErr, setFileErr] = useState('');
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mktAllRef = useRef<HTMLInputElement>(null);

  // 마케팅 3채널 ↔ 전체 동의 양방향 동기화 (§E-2)
  const mktAll = mkt.email && mkt.sms && mkt.tel;
  const mktSome = (mkt.email || mkt.sms || mkt.tel) && !mktAll;
  useEffect(() => {
    if (mktAllRef.current) mktAllRef.current.indeterminate = mktSome;
  }, [mktSome]);
  const toggleMktAll = (checked: boolean) => setMkt({ email: checked, sms: checked, tel: checked });
  const toggleMkt = (k: 'email' | 'sms' | 'tel') => setMkt((p) => ({ ...p, [k]: !p[k] }));

  const upd = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  function resetFile(msg: string) {
    setFile(null);
    setFileName(FILE_PLACEHOLDER);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (msg) setFileErr(msg);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileErr('');
    const f = e.target.files?.[0];
    if (!f) return resetFile('');
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED.includes(ext)) return resetFile('허용되지 않는 파일 형식입니다.');
    if (f.size > MAX) return resetFile('파일 용량은 최대 10MB까지 가능합니다.');
    setFile(f);
    setFileName(`${f.name} (${(f.size / 1048576).toFixed(1)}MB)`);
  }

  // 제출 차단 조건 = 필수 4개(회사·기관명 / 담당자명 / 이메일 / 개인정보 동의)만 검사 (§C-2 · §F)
  function submit() {
    if (hp) return; // 허니팟
    const next: Record<string, boolean> = {};
    let ok = true;
    (['company', 'name'] as const).forEach((k) => {
      const bad = !(v[k] || '').trim();
      next[k] = bad;
      if (bad) ok = false;
    });
    const emailOK = EMAIL_RE.test((v.email || '').trim());
    next.email = !emailOK;
    if (!emailOK) ok = false;
    setErrs(next);
    const cBad = !consent;
    setConsentErr(cBad);
    if (cBad) ok = false;
    if (fileErr) ok = false;
    if (!ok) return;

    const payload: InquiryPayload = {
      companyName: v.company.trim(),
      managerName: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      eduScale: v.eduScale as InquiryPayload['eduScale'],
      interests: INQ.interests.filter((o) => interests[o.value]).map((o) => o.value),
      message: v.message.trim(),
      attachment: file,
      agreePrivacy: true,
      agreeMarketingEmail: mkt.email,
      agreeMarketingSms: mkt.sms,
      agreeMarketingTel: mkt.tel,
    };
    submitInquiry(payload);
    setDone(true);
  }

  const fld = (k: string) => `field${errs[k] ? ' invalid' : ''}`;

  return (
    <section className="section inq" id="inq">
      <div className="wrap">
        <div className="inq-grid">
          <div className="inq-side r">
            <div>
              <p className="lead">{INQ.side.lead}</p>
              <p className="leadsub">{INQ.side.sub}</p>
            </div>
            <div className="trust">
              {INQ.side.trust.map((t, i) => (
                <span key={t} style={{ display: 'contents' }}>
                  <span>{t}</span>
                  {i < INQ.side.trust.length - 1 && <span>·</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="form r">
            {!done ? (
              <div id="form-body">
                {/* 1·2 회사·기관명(필수) / 담당자명(필수) */}
                <div className="frow">
                  <div className={fld('company')}>
                    <label htmlFor="f-company">회사·기관명 <span className="req">*</span></label>
                    <input id="f-company" value={v.company} onChange={upd('company')} aria-required="true" aria-invalid={!!errs.company} />
                    <span className="err" aria-live="polite">회사·기관명을 입력해 주세요.</span>
                  </div>
                  <div className={fld('name')}>
                    <label htmlFor="f-name">담당자명 <span className="req">*</span></label>
                    <input id="f-name" value={v.name} onChange={upd('name')} aria-required="true" aria-invalid={!!errs.name} />
                    <span className="err" aria-live="polite">담당자명을 입력해 주세요.</span>
                  </div>
                </div>

                {/* 3·4 이메일(필수) / 연락처(선택) */}
                <div className="frow">
                  <div className={fld('email')}>
                    <label htmlFor="f-email">이메일 <span className="req">*</span></label>
                    <input id="f-email" type="email" value={v.email} onChange={upd('email')} aria-required="true" aria-invalid={!!errs.email} />
                    <span className="err" aria-live="polite">올바른 이메일을 입력해 주세요.</span>
                  </div>
                  <div className="field">
                    <label htmlFor="f-phone">연락처</label>
                    <input id="f-phone" value={v.phone} onChange={upd('phone')} />
                  </div>
                </div>

                {/* 5 교육 대상 규모(선택) */}
                <div className="field">
                  <label htmlFor="f-scale">교육 대상 규모 <span className="lopt">(교육 인원)</span></label>
                  <select id="f-scale" value={v.eduScale} onChange={upd('eduScale')}>
                    <option value="">선택</option>
                    {INQ.sizes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                {/* 6 관심 영역(선택·다중) */}
                <div className="field">
                  <label id="f-interests-label" htmlFor="f-interests-label">관심 영역</label>
                  <div className="chips" role="group" aria-labelledby="f-interests-label">
                    {INQ.interests.map((o) => (
                      <button
                        type="button"
                        key={o.value}
                        className={`mchip${interests[o.value] ? ' on' : ''}`}
                        aria-pressed={!!interests[o.value]}
                        onClick={() => setInterests((s) => ({ ...s, [o.value]: !s[o.value] }))}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7 문의 내용(선택) */}
                <div className="field"><label htmlFor="f-msg">문의 내용</label><textarea id="f-msg" rows={3} value={v.message} onChange={upd('message')} /></div>

                {/* 8 첨부파일(선택) */}
                <div className="field"><label htmlFor="f-file">첨부파일</label>
                  <label className={`filebox${file ? ' has' : ''}`} htmlFor="f-file">{fileName}</label>
                  <input id="f-file" ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".zip,.pdf,.hwp,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif" onChange={onFile} />
                  <div className="filehint">zip·pdf·hwp·ppt·pptx·doc·docx·xls·xlsx·jpg·png·gif / 최대 10MB</div>
                  {fileErr && <span className="err" style={{ display: 'block' }} aria-live="polite">{fileErr}</span>}
                </div>

                <input className="hp" tabIndex={-1} autoComplete="off" placeholder="website" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />

                <div className="consent-group">
                  {/* 9 개인정보 수집·이용 동의(필수) */}
                  <div className={`consent${consentErr ? ' invalid' : ''}`}>
                    <label className="consent-main"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-required="true" aria-invalid={consentErr} /><span><b className="c-tag req-tag">필수</b> 개인정보 수집·이용 동의</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, priv: !s.priv }))}>{consentOpen.priv ? '접기' : '전문 보기'}</button>
                  </div>
                  {consentErr && <span className="err" style={{ display: 'block', marginTop: 0 }} aria-live="polite">개인정보 수집·이용에 동의해 주세요.</span>}
                  <div className="consent-text" style={{ maxHeight: consentOpen.priv ? 240 : 0 }}><div className="ct-inner"><p><b>개인정보 수집·이용 동의 (필수)</b></p><p>KG에듀원 KEESS 서비스를 제공하기 위해 필요한 필수 정보를 아래와 같이 수집·이용하고자 하오니, 이에 동의하여 주시기를 부탁드립니다.</p><p><b>1. 수집·이용 목적</b><br />상담신청 및 안내 — KEESS 직원 교육 상담신청 서비스의 상담·안내를 위한 자료 활용</p><p><b>2. 수집 항목</b><br />(필수) 이름, 전화번호, 이메일</p><p><b>3. 보유 및 이용 기간</b><br />법령에 따른 보유·이용 기간 또는 동의받은 기간 내에서 처리·보유합니다. 수집·보유 근거: 정보주체의 동의 / 보유·이용기간: 동의일로부터 1년간(보유목적 달성) 또는 삭제 요청 시 지체 없이 파기.</p><p><b>4. 동의 거부 권리</b><br />동의를 거부할 권리가 있습니다. 다만 거부 시 상담 서비스 이용이 제한될 수 있습니다.</p></div></div>

                  {/* 10 마케팅 정보 수신 동의(선택) — 전체 + 3채널 개별 (§E) */}
                  <div className="consent">
                    <label className="consent-main"><input ref={mktAllRef} type="checkbox" checked={mktAll} aria-checked={mktSome ? 'mixed' : mktAll} onChange={(e) => toggleMktAll(e.target.checked)} /><span><b className="c-tag opt-tag">선택</b> 마케팅 정보 수신 전체 동의</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, mkt: !s.mkt }))}>{consentOpen.mkt ? '접기' : '전문 보기'}</button>
                  </div>
                  <div className="mkt-sub" role="group" aria-label="마케팅 정보 수신 채널">
                    <label className="mkt-item"><input type="checkbox" checked={mkt.email} onChange={() => toggleMkt('email')} /><span>이메일</span></label>
                    <label className="mkt-item"><input type="checkbox" checked={mkt.sms} onChange={() => toggleMkt('sms')} /><span>SMS(문자)</span></label>
                    <label className="mkt-item"><input type="checkbox" checked={mkt.tel} onChange={() => toggleMkt('tel')} /><span>전화(TM)</span></label>
                  </div>
                  <div className="consent-text" style={{ maxHeight: consentOpen.mkt ? 240 : 0 }}><div className="ct-inner"><p><b>마케팅 정보 수신 동의 (선택)</b></p><p>KG에듀원 KEESS는 「개인정보 보호법」 제22조에 의거하여 마케팅 목적의 개인정보 수집·이용에 대해 별도 동의를 받습니다. 동의를 거부하셔도 서비스 이용이 가능하며, 일부 서비스·혜택 제공이 제한될 수 있습니다.</p><p><b>수집·이용 목적</b><br />모바일 상품권(기프티콘) MMS 발송</p><p><b>수집 항목</b><br />이름, 전화번호, 이메일</p><p><b>보유 및 이용 기간</b><br />모바일 상품권(기프티콘) 수령 완료 시까지</p><p>상기 이외의 마케팅 목적으로 수집·이용 시 별도 동의를 받습니다.</p></div></div>
                </div>
                <button className="btn submit" onClick={submit}>상담 신청</button>
              </div>
            ) : (
              <div className="form-done show">
                <div className="check">✓</div>
                <h4>{INQ.success.title}</h4>
                <p>{INQ.success.msg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

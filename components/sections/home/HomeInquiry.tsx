'use client';

import { useRef, useState } from 'react';
import { INQ } from '@/data/home';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED = ['zip', 'pdf', 'hwp', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'];
const MAX = 10 * 1024 * 1024;

export default function HomeInquiry() {
  const [v, setV] = useState({ sector: '', size: '', company: '', name: '', email: '', phone: '', message: '' });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [interests, setInterests] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [mkt, setMkt] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const [consentOpen, setConsentOpen] = useState<Record<string, boolean>>({});
  const [hp, setHp] = useState('');
  const [fileName, setFileName] = useState('파일을 선택하거나 끌어다 놓으세요');
  const [fileHas, setFileHas] = useState(false);
  const [fileErr, setFileErr] = useState('');
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upd = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));

  const rm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setFileErr('');
    setFileHas(false);
    const f = e.target.files?.[0];
    if (!f) {
      setFileName('파일을 선택하거나 끌어다 놓으세요');
      return;
    }
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED.includes(ext)) {
      setFileErr('허용되지 않는 파일 형식입니다.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFileName('파일을 선택하거나 끌어다 놓으세요');
      return;
    }
    if (f.size > MAX) {
      setFileErr('파일 용량은 최대 10MB까지 가능합니다.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setFileName('파일을 선택하거나 끌어다 놓으세요');
      return;
    }
    setFileHas(true);
    setFileName(`${f.name} (${(f.size / 1048576).toFixed(1)}MB)`);
  }

  function submit() {
    if (hp) return; // 허니팟
    const next: Record<string, boolean> = {};
    let ok = true;
    (['sector', 'size', 'company', 'name'] as const).forEach((k) => {
      const bad = !(v[k] || '').trim();
      next[k] = bad;
      if (bad) ok = false;
    });
    const emailOK = emailRe.test((v.email || '').trim());
    next.email = !emailOK;
    if (!emailOK) ok = false;
    setErrs(next);
    const cBad = !consent;
    setConsentErr(cBad);
    if (cBad) ok = false;
    if (fileErr) ok = false;
    if (!ok) return;
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
                <div className="frow">
                  <div className={fld('sector')}><label>부문 <span className="req">*</span></label>
                    <select value={v.sector} onChange={upd('sector')}><option value="">선택</option>{INQ.sectors.map((o) => <option key={o}>{o}</option>)}</select>
                    <span className="err">부문을 선택해 주세요.</span>
                  </div>
                  <div className={fld('size')}><label>교육 대상 규모 <span className="req">*</span></label>
                    <select value={v.size} onChange={upd('size')}><option value="">선택</option>{INQ.sizes.map((o) => <option key={o}>{o}</option>)}</select>
                    <span className="err">규모를 선택해 주세요.</span>
                  </div>
                </div>
                <div className="frow">
                  <div className={fld('company')}><label>회사·기관명 <span className="req">*</span></label><input value={v.company} onChange={upd('company')} /><span className="err">회사·기관명을 입력해 주세요.</span></div>
                  <div className={fld('name')}><label>담당자명 <span className="req">*</span></label><input value={v.name} onChange={upd('name')} /><span className="err">담당자명을 입력해 주세요.</span></div>
                </div>
                <div className="frow">
                  <div className={fld('email')}><label>이메일 <span className="req">*</span></label><input type="email" value={v.email} onChange={upd('email')} /><span className="err">올바른 이메일을 입력해 주세요.</span></div>
                  <div className="field"><label>연락처</label><input value={v.phone} onChange={upd('phone')} /></div>
                </div>
                <div className="field"><label>관심 영역</label>
                  <div className="chips">
                    {INQ.interests.map((it) => (
                      <span key={it} className={`mchip${interests[it] ? ' on' : ''}`} onClick={() => setInterests((s) => ({ ...s, [it]: !s[it] }))}>{it}</span>
                    ))}
                  </div>
                </div>
                <div className="field"><label>문의 내용</label><textarea rows={3} value={v.message} onChange={upd('message')} /></div>
                <div className="field"><label>첨부파일</label>
                  <label className={`filebox${fileHas ? ' has' : ''}`} htmlFor="f-file">{fileName}</label>
                  <input id="f-file" ref={fileInputRef} type="file" style={{ display: 'none' }} accept=".zip,.pdf,.hwp,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif" onChange={onFile} />
                  <div className="filehint">zip·pdf·hwp·ppt·pptx·doc·docx·xls·xlsx·jpg·png·gif / 최대 10MB</div>
                  {fileErr && <span className="err" style={{ display: 'block' }}>{fileErr}</span>}
                </div>
                <input className="hp" tabIndex={-1} autoComplete="off" placeholder="website" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden="true" />

                <div className="consent-group">
                  <div className={`consent${consentErr ? ' invalid' : ''}`}>
                    <label className="consent-main"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span><b className="c-tag req-tag">필수</b> 개인정보 수집·이용 동의</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, priv: !s.priv }))}>{consentOpen.priv ? '접기' : '전문 보기'}</button>
                  </div>
                  <div className="consent-text" style={{ maxHeight: consentOpen.priv ? 240 : 0 }}><div className="ct-inner"><p><b>개인정보 수집·이용 동의 (필수)</b></p><p>KG에듀원 KEESS 서비스를 제공하기 위해 필요한 필수 정보를 아래와 같이 수집·이용하고자 하오니, 이에 동의하여 주시기를 부탁드립니다.</p><p><b>1. 수집·이용 목적</b><br />상담신청 및 안내 — KEESS 직원 교육 상담신청 서비스의 상담·안내를 위한 자료 활용</p><p><b>2. 수집 항목</b><br />(필수) 이름, 전화번호, 이메일</p><p><b>3. 보유 및 이용 기간</b><br />법령에 따른 보유·이용 기간 또는 동의받은 기간 내에서 처리·보유합니다. 수집·보유 근거: 정보주체의 동의 / 보유·이용기간: 동의일로부터 1년간(보유목적 달성) 또는 삭제 요청 시 지체 없이 파기.</p><p><b>4. 동의 거부 권리</b><br />동의를 거부할 권리가 있습니다. 다만 거부 시 상담 서비스 이용이 제한될 수 있습니다.</p></div></div>
                  <div className="consent">
                    <label className="consent-main"><input type="checkbox" checked={mkt} onChange={(e) => setMkt(e.target.checked)} /><span><b className="c-tag opt-tag">선택</b> 마케팅 정보 수신 동의</span></label>
                    <button type="button" className="consent-view" onClick={() => setConsentOpen((s) => ({ ...s, mkt: !s.mkt }))}>{consentOpen.mkt ? '접기' : '전문 보기'}</button>
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

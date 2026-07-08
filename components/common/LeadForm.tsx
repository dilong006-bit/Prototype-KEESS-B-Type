'use client';

import { useEffect, useState } from 'react';

export interface LeadField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
  /** 2단 그리드 묶음용 그룹 인덱스(같은 값끼리 .frow) */
  row?: number;
}

interface LeadFormProps {
  fields: LeadField[];
  /** 프리셀렉트할 select 필드명 + 값 (예: interest → '정부지원 환급') */
  preselectField?: string;
  preselect?: string;
  /** 접수 소스 태깅(F10) */
  source?: string;
  submitLabel?: string;
  consentLabel?: string;
  successTitle?: string;
  successMsg?: string;
  onSuccess?: (data: Record<string, string>) => void;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadForm({
  fields,
  preselectField,
  preselect,
  source = 'consult',
  submitLabel = '상담 신청',
  consentLabel = '개인정보 수집·이용 동의',
  successTitle = '상담 신청이 접수되었습니다.',
  successMsg = '담당자가 영업일 기준 1일 내 회신드립니다.',
  onSuccess,
}: LeadFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [consent, setConsent] = useState(false);
  const [consentErr, setConsentErr] = useState(false);
  const [hp, setHp] = useState('');
  const [done, setDone] = useState(false);

  // 프리셀렉트 (P3 정부지원 CTA 등)
  useEffect(() => {
    if (preselectField && preselect) {
      setValues((v) => ({ ...v, [preselectField]: preselect }));
    }
  }, [preselectField, preselect]);

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  function submit() {
    if (hp) return; // 허니팟
    const next: Record<string, boolean> = {};
    let ok = true;
    fields.forEach((f) => {
      if (!f.required) return;
      const val = (values[f.name] || '').trim();
      let bad = !val;
      if (f.type === 'email' && val && !emailRe.test(val)) bad = true;
      next[f.name] = bad;
      if (bad) ok = false;
    });
    setErrs(next);
    const cBad = !consent;
    setConsentErr(cBad);
    if (cBad) ok = false;
    if (!ok) return;
    setDone(true);
    onSuccess?.({ ...values, source });
  }

  // .frow 그룹핑
  const rendered: React.ReactNode[] = [];
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    if (f.row !== undefined && fields[i + 1]?.row === f.row) {
      rendered.push(
        <div className="frow" key={`row-${i}`}>
          {renderField(fields[i])}
          {renderField(fields[i + 1])}
        </div>
      );
      i += 2;
    } else {
      rendered.push(renderField(f));
      i += 1;
    }
  }

  function renderField(f: LeadField) {
    const cls = `field${errs[f.name] ? ' invalid' : ''}`;
    return (
      <div className={cls} key={f.name}>
        <label>
          {f.label} {f.required && <span className="req">*</span>}
        </label>
        {f.type === 'select' ? (
          <select value={values[f.name] || ''} onChange={set(f.name)}>
            <option value="">선택</option>
            {f.options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : f.type === 'textarea' ? (
          <textarea rows={3} placeholder={f.placeholder} value={values[f.name] || ''} onChange={set(f.name)} />
        ) : (
          <input type={f.type} placeholder={f.placeholder} value={values[f.name] || ''} onChange={set(f.name)} />
        )}
        <span className="err">필수 항목을 확인해 주세요.</span>
      </div>
    );
  }

  if (done) {
    return (
      <div className="form-done show">
        <div className="check">✓</div>
        <h4>{successTitle}</h4>
        <p>{successMsg}</p>
      </div>
    );
  }

  return (
    <div>
      {rendered}
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        placeholder="website"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        aria-hidden="true"
      />
      <div className="consent-group">
        <div className={`consent${consentErr ? ' invalid' : ''}`}>
          <label className="consent-main">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span><b className="c-tag req-tag">필수</b> {consentLabel}</span>
          </label>
        </div>
      </div>
      <button className="btn btn-ink" type="button" style={{ width: '100%', marginTop: 20 }} onClick={submit}>
        {submitLabel}
      </button>
    </div>
  );
}

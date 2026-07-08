'use client';

import { useState } from 'react';
import { FAQ, FAQ_TABS } from '@/data/home';

export default function HomeFaq() {
  const [type, setType] = useState('1');
  // 각 타입에서 열린 항목 인덱스(원본: 타입 전환 시 첫 항목 자동 오픈)
  const firstOfType = (t: string) => FAQ.items.findIndex((it) => it.type === t);
  const [openIdx, setOpenIdx] = useState<number>(firstOfType('1'));

  const showType = (t: string) => {
    setType(t);
    setOpenIdx(firstOfType(t));
  };

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <p className="eyebrow r">{FAQ.eyebrow}</p>
        <h2 className="sec-title r" style={{ marginTop: 12 }}>{FAQ.title}</h2>
        <p
          className="leadsub r"
          style={{ marginTop: 18, color: 'var(--muted)', fontSize: 16.5, maxWidth: '56ch', lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: FAQ.sub }}
        />
        <div className="faq-tabs r">
          {FAQ_TABS.map((t) => (
            <button
              key={t.type}
              className={`faq-tab${type === t.type ? ' on' : ''}`}
              onClick={() => showType(t.type)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="faq-list r">
          {FAQ.items.map((it, idx) => {
            if (it.type !== type) return null;
            const open = openIdx === idx;
            return (
              <div className={`faq-item${open ? ' open' : ''}`} key={it.qn} data-type={it.type}>
                <button
                  className="faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenIdx(open ? -1 : idx)}
                >
                  <span className="qn">{it.qn}</span>
                  <span className="qt">{it.qt}</span>
                  <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className="faq-a" style={{ maxHeight: open ? 500 : 0 }}>
                  <div className="faq-a-inner">
                    <p>{it.a}</p>
                    {it.acta && (
                      <a className="acta" href={it.acta.href}>
                        {it.acta.label} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="faq-foot r">
          <span className="faq-foot-t">{FAQ.foot}</span>
          <a className="btn btn-ink faq-cta" href="#inq">도입 문의하기</a>
        </div>
      </div>
    </section>
  );
}

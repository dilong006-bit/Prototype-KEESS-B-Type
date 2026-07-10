'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS, LOGO, type NavKey } from '@/data/nav';

// 교육 상담 아이콘 (§0.5-6 · 말풍선 · 인터랙션 강화만, 구성·카피 불변)
function ChatIcon() {
  return (
    <svg className="btn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.5a8.4 8.4 0 0 1-.8-3.6A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  );
}

interface NavProps {
  current: NavKey;
  /** 교육 상담 CTA 목적지 (기본: 현재 페이지 #inq) */
  consultHref?: string;
}

export default function Nav({ current, consultHref = '#inq' }: NavProps) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const thresholdRef = useRef(40);

  // 스크롤 solid 전환 (원본 859: hero 높이 기준, hero 없으면 40px)
  useEffect(() => {
    const hero = document.getElementById('hero');
    thresholdRef.current = hero ? hero.offsetHeight - 90 : 40;
    const onScroll = () => setSolid(window.scrollY > thresholdRef.current);
    const onResize = () => {
      const h = document.getElementById('hero');
      thresholdRef.current = h ? h.offsetHeight - 90 : 40;
      onScroll();
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  // 모바일 메뉴 body lock + ESC
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const rm = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 로고: 홈에서는 최상단 스크롤 (§0.5-2)
  const onLogo = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: rm() ? 'auto' : 'smooth' });
    }
  };

  // 교육 상담: 같은 페이지 #inq 이면 스크롤, 아니면 라우팅
  const onConsult = (e: React.MouseEvent) => {
    if (consultHref.startsWith('#')) {
      const el = document.querySelector(consultHref);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: rm() ? 'auto' : 'smooth' });
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`nav${solid ? ' solid' : ''}${menuOpen ? ' menu-open' : ''}`} id="nav">
        <div className="wrap nav-in">
          <Link className="logo" href={LOGO.href} onClick={onLogo} aria-label="KEESS 홈">
            {LOGO.label}
          </Link>
          <nav className="menu" aria-label="주요 메뉴">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={item.key === current ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            className="btn btn-glass nav-cta"
            href={consultHref}
            onClick={onConsult}
          >
            <ChatIcon />
            교육 상담
          </a>
          <button
            className={`hamb${menuOpen ? ' open' : ''}`}
            id="hamb"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="mmenu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <nav className={`mmenu${menuOpen ? ' open' : ''}`} id="mmenu" aria-label="모바일 메뉴" aria-hidden={!menuOpen}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            aria-current={item.key === current ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <a className="btn btn-ink" href={consultHref} onClick={onConsult}>
          <ChatIcon />
          교육 상담
        </a>
      </nav>
    </>
  );
}

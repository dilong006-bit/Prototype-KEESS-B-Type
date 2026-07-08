import { createElement } from 'react';

interface RevealProps {
  as?: keyof JSX.IntrinsicElements;
  stagger?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  children: React.ReactNode;
}

/** 스크롤 리빌 래퍼 — useReveal가 .r/.stagger를 관찰해 .in 부여. */
export default function Reveal({
  as = 'div',
  stagger = false,
  className = '',
  style,
  id,
  children,
}: RevealProps) {
  const cls = `${stagger ? 'stagger' : 'r'} ${className}`.trim();
  return createElement(as, { className: cls, style, id }, children);
}

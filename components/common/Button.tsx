'use client';

import Link from 'next/link';

type Variant = 'primary' | 'glass' | 'line' | 'ghost';

const CLASS: Record<Variant, string> = {
  primary: 'btn btn-ink',
  glass: 'btn btn-glass',
  line: 'btn-line-dark',
  ghost: 'btn',
};

interface ButtonProps {
  variant?: Variant;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit';
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export default function Button({
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  children,
  ariaLabel,
  style,
}: ButtonProps) {
  const cls = `${CLASS[variant]} ${className}`.trim();
  if (href) {
    const isInternalRoute = href.startsWith('/') && !href.startsWith('//');
    if (isInternalRoute) {
      return (
        <Link className={cls} href={href} onClick={onClick} aria-label={ariaLabel} style={style}>
          {children}
        </Link>
      );
    }
    return (
      <a className={cls} href={href} onClick={onClick} aria-label={ariaLabel} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} aria-label={ariaLabel} style={style}>
      {children}
    </button>
  );
}

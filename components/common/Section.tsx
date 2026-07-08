interface SectionProps {
  id?: string;
  className?: string;
  dark?: boolean;
  wrap?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/** 섹션 리듬 컨테이너 (Design.md §4 · .section 120/74). */
export default function Section({
  id,
  className = '',
  dark = false,
  wrap = true,
  style,
  children,
}: SectionProps) {
  const cls = `section ${className}`.trim();
  const inner = wrap ? <div className="wrap">{children}</div> : children;
  return (
    <section
      id={id}
      className={cls}
      style={dark ? { background: 'var(--ink)', color: '#fff', ...style } : style}
    >
      {inner}
    </section>
  );
}

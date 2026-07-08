interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/** 기본 카드 (--surface + --line, radius --r, hover 상승). */
export default function Card({ className = '', style, children }: CardProps) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return <span className="chip-pill">{children}</span>;
}

export function Badge({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <span className="badge-pill" style={style}>{children}</span>;
}

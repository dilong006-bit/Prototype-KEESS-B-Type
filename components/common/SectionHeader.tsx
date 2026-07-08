interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: 'left' | 'center';
  reveal?: boolean;
}

/** eyebrow → title → sub 고정 위계 (Design.md §5). */
export default function SectionHeader({
  eyebrow,
  title,
  sub,
  align = 'left',
  reveal = true,
}: SectionHeaderProps) {
  const r = reveal ? ' r' : '';
  return (
    <div style={align === 'center' ? { textAlign: 'center' } : undefined}>
      <p className={`eyebrow${r}`}>{eyebrow}</p>
      <h2 className={`sec-title${r}`} style={{ marginTop: 14 }}>{title}</h2>
      {sub && (
        <p className={`sec-sub${r}`} style={align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>
          {sub}
        </p>
      )}
    </div>
  );
}

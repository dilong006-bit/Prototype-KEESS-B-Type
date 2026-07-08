'use client';

/** Unsplash 슬롯 이미지 — 원본 onerror='this.style.display=none' 폴백. */
export default function Img({
  className,
  src,
  alt = '',
  eager = false,
}: {
  className?: string;
  src: string;
  alt?: string;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

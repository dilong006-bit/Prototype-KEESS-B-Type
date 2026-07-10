'use client';

import { useModal } from '@/lib/useModal';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
}

/** 범용 모달 (pv-overlay/pv-dialog 시각 공유 · 포커스 트랩·ESC·스크림). */
export default function Modal({
  open,
  onClose,
  labelledBy,
  title,
  children,
  maxWidth = 540,
}: ModalProps) {
  const ref = useModal(open, onClose);
  return (
    <div
      className={`pv-overlay${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="pv-dialog" ref={ref} style={{ maxWidth }}>
        <div className="pv-head">
          <h3 id={labelledBy}>{title}</h3>
          <button className="pv-close" type="button" aria-label="닫기" onClick={onClose} data-autofocus>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <div className="pv-body">{children}</div>
      </div>
    </div>
  );
}

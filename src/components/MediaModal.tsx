import { useEffect, useId, useRef } from "react";

type MediaModalProps = {
  onClose: () => void;
};

export function MediaModal({ onClose }: MediaModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const grainId = useId().replace(/:/g, "");

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div className="media" role="dialog" aria-modal="true" aria-label="BLONDE 2LP VINYL">
      <button ref={closeRef} className="media__close" type="button" aria-label="Close" onClick={onClose}>
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </button>
      <div className="media__frame">
        <img className="product__photo product__photo--catalog" src="/blonde-vinyl.jpg" alt="BLONDE 2LP VINYL" width={1024} height={1024} />
        <img className="product__photo product__photo--alt" src="/blonde-vinyl.jpg" alt="" aria-hidden="true" width={1024} height={1024} />
        <svg className="product__grain" aria-hidden="true">
          <filter id={grainId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${grainId})`} />
        </svg>
      </div>
    </div>
  );
}

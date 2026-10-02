import { useEffect, useRef } from "react";

type SwiftModalProps = {
  onClose: () => void;
};

export function SwiftModal({ onClose }: SwiftModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      className="swift"
      role="dialog"
      aria-modal="true"
      aria-labelledby="swift-caption"
      onMouseDown={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div className="swift__panel" ref={panelRef}>
        <button ref={closeRef} className="swift__close" type="button" onClick={onClose}>
          Close
        </button>
        <img
          className="swift__photo"
          src="/suzuki-swift.jpg"
          width={1280}
          height={720}
          alt="Yellow Suzuki Swift"
        />
        <p className="swift__caption" id="swift-caption">
          pammelitas is aw-som
        </p>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import suzukiSwift from "/suzuki-swift.jpg?url";

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
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div className="swift__panel" ref={panelRef}>
        <button ref={closeRef} className="swift__close" type="button" onClick={onClose}>
          Close
        </button>
        <img
          className="swift__photo"
          src={suzukiSwift}
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
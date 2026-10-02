import { useEffect, useRef, useState } from "react";

type AccountMenuProps = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function AccountPanel({ onClose }: { onClose: () => void }) {
  const [thanks, setThanks] = useState(false);

  return (
    <div className="account__panel" id="account-panel" role="dialog" aria-label="Log in">
      {thanks ? (
        <p className="account__thanks" role="status">
          Thanks!
        </p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setThanks(true);
            window.setTimeout(onClose, 900);
          }}
        >
          <label className="account__label" htmlFor="account-email">
            Log in
          </label>
          <input id="account-email" className="account__input" type="email" name="email" autoComplete="email" required />
          <button className="account__submit" type="submit">
            Continue
          </button>
        </form>
      )}
    </div>
  );
}

export function AccountMenu({ open, onToggle, onClose }: AccountMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, onClose]);

  return (
    <div className="account" ref={rootRef}>
      <button
        className="nav__account"
        type="button"
        aria-label="Log in"
        aria-expanded={open}
        aria-controls="account-panel"
        onClick={onToggle}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="10" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M7.1 17.6c1.05-2.05 2.75-3.05 4.9-3.05s3.85 1 4.9 3.05"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? <AccountPanel onClose={onClose} /> : null}
    </div>
  );
}

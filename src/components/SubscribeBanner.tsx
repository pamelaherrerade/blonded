import { useEffect, useId, useRef, useState } from "react";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Mexico",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Japan",
  "Australia",
  "Brazil",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "South Korea",
  "Argentina",
  "Colombia",
  "Nigeria",
  "South Africa",
  "India",
  "New Zealand",
];

type SubscribeBannerProps = {
  open: boolean;
  onClose: () => void;
};

export function SubscribeBanner({ open, onClose }: SubscribeBannerProps) {
  const [present, setPresent] = useState(open);
  const [shown, setShown] = useState(false);
  const [thanks, setThanks] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (open) {
      setPresent(true);
      setThanks(false);
      const frame = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setShown(true));
      });
      const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 400);
      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(focusTimer);
      };
    }

    setShown(false);
    const hideTimer = window.setTimeout(() => setPresent(false), 480);
    return () => window.clearTimeout(hideTimer);
  }, [open]);

  if (!present) return null;

  return (
    <section
      id="subscribe"
      className={shown ? "subscribe is-open" : "subscribe"}
      aria-hidden={!shown}
      aria-labelledby={titleId}
    >
      <div className="subscribe__wrap">
        <button className="subscribe__close" type="button" aria-label="Close signup form" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <div className="subscribe__title" id={titleId}>
          JOIN THE BLONDED MAILING LIST
        </div>
        <div role="status" aria-live="polite">
          {thanks ? <p className="subscribe__thanks">Thanks!</p> : null}
        </div>
        {thanks ? null : (
          <form
            className="subscribe__form"
            onSubmit={(event) => {
              event.preventDefault();
              setThanks(true);
              window.setTimeout(onClose, 1600);
            }}
          >
            <fieldset className="subscribe__fieldset">
              <div className="subscribe__field">
                <label className="subscribe__label" htmlFor="header_first_name">
                  First Name
                </label>
                <div className="subscribe__input">
                  <input
                    ref={firstFieldRef}
                    className="subscribe__text-input"
                    id="header_first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    required
                  />
                </div>
              </div>
              <div className="subscribe__field">
                <label className="subscribe__label" htmlFor="header_last_name">
                  Last Name
                </label>
                <div className="subscribe__input">
                  <input
                    className="subscribe__text-input"
                    id="header_last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>
              <div className="subscribe__field">
                <label className="subscribe__label" htmlFor="header_email">
                  Email
                </label>
                <div className="subscribe__input">
                  <input
                    className="subscribe__text-input"
                    id="header_email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              <div className="subscribe__field subscribe__field--wide">
                <label className="subscribe__label" htmlFor="join_country">
                  Country
                </label>
                <div className="subscribe__select">
                  <select className="subscribe__select-select" id="join_country" name="country" required defaultValue="">
                    <option value="" disabled>
                      Select Country
                    </option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="subscribe__submit" type="submit">
                Subscribe
              </button>
            </fieldset>
          </form>
        )}
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { AccountMenu } from "./components/AccountMenu";
import { NocturneRelease } from "./components/NocturneRelease";
import { ProductCard } from "./components/ProductCard";
import { SubscribeBanner } from "./components/SubscribeBanner";
import { SwiftModal } from "./components/SwiftModal";
import { TestarossaDrive } from "./components/TestarossaDrive";
import { formatBlondedTime } from "./formatTime";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || target.isContentEditable;
}

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [swiftOpen, setSwiftOpen] = useState(false);
  const [drive, setDrive] = useState<{ id: number; direction: "ltr" | "rtl" } | null>(null);

  const subscribeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Fijo siempre en fondo claro
  useEffect(() => {
    document.documentElement.dataset.version = "catalog";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
  }, []);

  useEffect(() => {
    document.body.style.overflow = swiftOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [swiftOpen]);

  const closeSubscribe = () => {
    setSubscribeOpen(false);
    subscribeButtonRef.current?.focus({ preventScroll: true });
  };

  const handleCartClick = () => {
    if (drive) return;
    setSwiftOpen(false); // asegura que no haya nada tapando
    setDrive({ id: Date.now(), direction: "ltr" }); // inicia el recorrido del auto
  };

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubscribeOpen(false);
    setAccountOpen(false);
    setSwiftOpen(false);
    setDrive(null);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (swiftOpen) setSwiftOpen(false);
        else if (accountOpen) setAccountOpen(false);
        else if (subscribeOpen) setSubscribeOpen(false);
        return;
      }

      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "y" || event.key === "Y") {
        event.preventDefault();
        handleCartClick();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountOpen, subscribeOpen, swiftOpen, drive]);

  return (
    <>
      <div className="theme-wash" aria-hidden="true" />
      <h1 className="sr-only">BLONDED</h1>
      <div className="page">
        <SubscribeBanner open={subscribeOpen} onClose={closeSubscribe} />
        <header className="nav">
          <div className="nav__left">
            <button
              ref={subscribeButtonRef}
              className="nav__text"
              type="button"
              aria-expanded={subscribeOpen}
              aria-controls="subscribe"
              onClick={() => {
                setAccountOpen(false);
                setSubscribeOpen((open) => !open);
              }}
            >
              Subscribe
            </button>
          </div>
          <button
            className="nav__mark"
            type="button"
            aria-label="BLONDED Home"
            onClick={goHome}
          >
            <svg viewBox="0 0 28 32" width="18" height="22" aria-hidden="true">
              <rect x="4" y="4" width="1.35" height="24" fill="currentColor" />
              <rect x="13.32" y="4" width="1.35" height="24" fill="currentColor" />
              <rect x="22.65" y="4" width="1.35" height="24" fill="currentColor" />
            </svg>
          </button>
          <div className="nav__right">
            <AccountMenu
              open={accountOpen}
              onToggle={() => {
                setSubscribeOpen(false);
                setAccountOpen((open) => !open);
              }}
              onClose={() => setAccountOpen(false)}
            />
            <button
              className="nav__text nav__cart"
              type="button"
              onClick={handleCartClick}
            >
              Cart
            </button>
          </div>
        </header>
        <p className="clock" id="header-date-time">
          {formatBlondedTime(now)}
        </p>
        <main>
          <NocturneRelease />
          <ProductCard />
        </main>
      </div>

      {drive ? (
        <TestarossaDrive
          id={drive.id}
          direction={drive.direction}
          onDone={() => {
            setDrive(null);
            setSwiftOpen(true);
          }}
        />
      ) : null}

      {swiftOpen ? (
        <SwiftModal onClose={() => setSwiftOpen(false)} />
      ) : null}
    </>
  );
}
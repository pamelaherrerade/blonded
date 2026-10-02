import { useEffect, useRef, useState } from "react";
import { AccountMenu } from "./components/AccountMenu";
import { NocturneRelease } from "./components/NocturneRelease";
import { ProductCard } from "./components/ProductCard";
import { SubscribeBanner } from "./components/SubscribeBanner";
import { SwiftModal } from "./components/SwiftModal";
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
  const [carRunning, setCarRunning] = useState(false);

  const subscribeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

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

  // Cruza el Testarossa y al terminar abre el Suzuki Swift
  const handleCartClick = () => {
    if (carRunning) return;
    setSwiftOpen(false);
    setCarRunning(true);

    setTimeout(() => {
      setCarRunning(false);
      setSwiftOpen(true);
    }, 1300);
  };

  const goHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubscribeOpen(false);
    setAccountOpen(false);
    setSwiftOpen(false);
    setCarRunning(false);
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
  }, [accountOpen, subscribeOpen, swiftOpen, carRunning]);

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
          {/* El botón PRE-ORDER NOW dentro de Nocturne también puede abrir el Suzuki directamente si quieres */}
          <NocturneRelease />
          <ProductCard />
        </main>
      </div>

      {/* 1. Animación del Testarossa */}
      {carRunning && (
        <div
          style={{
            position: "fixed",
            top: "45%",
            left: 0,
            width: "100vw",
            zIndex: 999999,
            pointerEvents: "none",
            transform: "translateY(-50%)",
          }}
        >
          <div
            style={{
              width: "250px",
              animation: "driveAcross 1.3s cubic-bezier(0.2, 0.85, 0.2, 1) forwards",
            }}
          >
            <svg viewBox="0 0 140 45" width="100%" height="auto" style={{ filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.3))" }}>
              <path d="M5 32 L18 20 L45 15 L100 15 L128 26 L138 32 L134 36 L5 36 Z" fill="#dc2626" />
              <path d="M48 17 L75 17 L92 26 L40 26 Z" fill="#18181b" />
              <line x1="50" y1="28" x2="85" y2="28" stroke="#991b1b" strokeWidth="2" />
              <line x1="54" y1="31" x2="82" y2="31" stroke="#991b1b" strokeWidth="2" />
              <rect x="133" y="30" width="5" height="3" fill="#facc15" />
              <rect x="5" y="30" width="4" height="4" fill="#7f1d1d" />
              <circle cx="32" cy="36" r="8" fill="#18181b" />
              <circle cx="32" cy="36" r="4" fill="#9ca3af" />
              <circle cx="110" cy="36" r="8" fill="#18181b" />
              <circle cx="110" cy="36" r="4" fill="#9ca3af" />
            </svg>
          </div>
          <style>{`
            @keyframes driveAcross {
              0% { transform: translateX(-280px); }
              100% { transform: translateX(105vw); }
            }
          `}</style>
        </div>
      )}

      {/* 2. Modal original del Suzuki Swift */}
      {swiftOpen && (
        <SwiftModal onClose={() => setSwiftOpen(false)} />
      )}
    </>
  );
}
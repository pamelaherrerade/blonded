import { useCallback, useEffect, useRef, useState } from "react";
import { AccountMenu } from "./components/AccountMenu";
import { MediaModal, type MediaView } from "./components/MediaModal";
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
  const [media, setMedia] = useState<MediaView | null>(null);
  const [swiftOpen, setSwiftOpen] = useState(false);
  const [alternate, setAlternate] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [drive, setDrive] = useState<{ id: number; direction: "ltr" | "rtl" } | null>(null);

  const subscribeButtonRef = useRef<HTMLButtonElement>(null);
  const alternateRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.version = alternate ? "alt" : "catalog";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", alternate ? "#09090b" : "#ffffff");
  }, [alternate]);

  useEffect(() => {
    document.body.style.overflow = media || swiftOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [media, swiftOpen]);

  const closeSubscribe = () => {
    setSubscribeOpen(false);
    subscribeButtonRef.current?.focus({ preventScroll: true });
  };

  const toggleVersion = useCallback(() => {
    const next = !alternateRef.current;
    alternateRef.current = next;
    setAlternate(next);
    setAnnouncement(next ? "Two versions." : "Catalog.");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrive({ id: Date.now(), direction: next ? "ltr" : "rtl" });
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (swiftOpen) setSwiftOpen(false);
        else if (media) setMedia(null);
        else if (accountOpen) setAccountOpen(false);
        else if (subscribeOpen) setSubscribeOpen(false);
        return;
      }

      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "y" || event.key === "Y") {
        event.preventDefault();
        toggleVersion();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [accountOpen, media, subscribeOpen, swiftOpen, toggleVersion]);

  return (
    <>
      <div className="theme-wash" aria-hidden="true" />
      <h1 className="sr-only">BLONDED</h1>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
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
            aria-label="BLONDED"
            onClick={() => {
              document.getElementById("nocturne")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
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
              aria-pressed={alternate}
              onClick={toggleVersion}
            >
              Cart
            </button>
          </div>
        </header>
        <p className="clock" id="header-date-time">
          {formatBlondedTime(now)}
        </p>
        <main>
          <NocturneRelease
            onOpenCover={() =>
              setMedia({
                label: "TESTAROSSA NOCTURNE 2LP VINYL",
                catalog: "/nocturne-cover.jpg",
                alternate: "/nocturne-thermal.jpg",
                treatment: "plate",
              })
            }
            onPreorder={() => setSwiftOpen(true)}
          />
          <ProductCard
            onOpen={() =>
              setMedia({
                label: "BLONDE 2LP VINYL",
                catalog: "/blonde-vinyl.jpg",
                alternate: "/blonde-vinyl.jpg",
                treatment: "negative",
              })
            }
          />
        </main>
      </div>
      {media ? <MediaModal {...media} onClose={() => setMedia(null)} /> : null}
      {swiftOpen ? (
        <SwiftModal
          onClose={() => {
            setSwiftOpen(false);
            document.getElementById("preorder")?.focus();
          }}
        />
      ) : null}
      {drive ? (
        <TestarossaDrive id={drive.id} direction={drive.direction} onDone={() => setDrive(null)} />
      ) : null}
    </>
  );
}

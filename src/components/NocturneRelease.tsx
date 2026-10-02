import { useEffect, useId, useState } from "react";
import "@fontsource/jetbrains-mono/400.css";
import nocturneCover from "/nocturne-cover.jpg?url";
import nocturneThermal from "/nocturne-thermal.jpg?url";

const TRACKS = [
  { id: "01", title: "TESTAROSSA", seconds: 222 },
  { id: "02", title: "CHANGES", seconds: 245 },
  { id: "03", title: "LOOK AT US, WE'RE IN LOVE", seconds: 311 },
  { id: "04", title: "LITTLE DEMON", seconds: 208 },
  { id: "05", title: "DEAR APRIL (REPRISE)", seconds: 176 },
  { id: "06", title: "LOBBY LIGHT", seconds: 258 },
  { id: "07", title: "RED GLASS", seconds: 231 },
  { id: "08", title: "NIGHT WINDOW", seconds: 284 },
  { id: "09", title: "CHANNEL 3", seconds: 159 },
  { id: "10", title: "HOMER, AFTER", seconds: 302 },
  { id: "11", title: "NOCTURNE", seconds: 367 },
];

function clock(total: number) {
  const whole = Math.max(0, Math.floor(total));
  const minutes = Math.floor(whole / 60);
  const seconds = whole % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function NocturneRelease() {
  const [failed, setFailed] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [added, setAdded] = useState(false);
  const grainId = useId().replace(/:/g, "");
  const active = TRACKS.find((track) => track.id === activeId) ?? null;

  useEffect(() => {
    if (!playing || !active) return;
    const id = window.setInterval(() => {
      setElapsed((value) => (value + 0.2) % active.seconds);
    }, 200);
    return () => window.clearInterval(id);
  }, [playing, active]);

  const choose = (id: string) => {
    if (activeId === id) {
      setPlaying((value) => !value);
      return;
    }
    setActiveId(id);
    setElapsed(0);
    setPlaying(true);
  };

  const handlePreorder = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <article className="product" id="nocturne">
      {failed ? (
        <div className="product__fallback" role="img" aria-label="TESTAROSSA NOCTURNE 2LP VINYL">
          <span>TESTAROSSA</span>
          <span>NOCTURNE</span>
        </div>
      ) : (
        <div className="product__shot product__shot--plate" style={{ cursor: "default" }}>
          <img
            className="product__photo product__photo--catalog"
            src={nocturneCover}
            width={1024}
            height={1024}
            alt="TESTAROSSA NOCTURNE, limited edition 2LP vinyl"
            onError={() => setFailed(true)}
          />
          <img
            className="product__photo product__photo--alt"
            src={nocturneThermal}
            width={1024}
            height={1024}
            alt=""
            aria-hidden="true"
          />
          <svg className="product__grain" aria-hidden="true">
            <filter id={grainId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${grainId})`} />
          </svg>
        </div>
      )}
      <div className="product__info">
        <h2 className="product__title">TESTAROSSA NOCTURNE</h2>
        <p className="product__edition">2LP VINYL / LIMITED EDITION</p>
        <div className="product__description">
          <p>
            <span>2 Record Gatefold Packaging</span>
            <br />
            <span>Heavyweight 180g Translucent Red Vinyl</span>
            <br />
            <span>32-Page Photography &amp; Lyric Booklet (Homer / BDC Archive)</span>
          </p>
          <p>
            <em>Please allow 6-12 weeks for fulfillment.</em>
          </p>
        </div>
        <p className="price">$ 75.00</p>
        <button
          id="preorder"
          className="preorder"
          type="button"
          onClick={handlePreorder}
        >
          {added ? "Order added!" : "Pre-order now"}
        </button>
        <div className="tracklist">
          <button
            className="tracklist__toggle"
            type="button"
            aria-expanded={listOpen}
            aria-controls="nocturne-tracks"
            onClick={() => {
              setPlaying(false);
              setListOpen((open) => !open);
            }}
          >
            View tracklist [11 tracks]
          </button>
          <div className={listOpen ? "tracks is-open" : "tracks"} id="nocturne-tracks">
            <div className="tracks__clip">
              <ol className="tracks__list">
                {TRACKS.map((track) => (
                  <li className="tracks__item" key={track.id}>
                    <button
                      className={track.id === activeId ? "tracks__button is-active" : "tracks__button"}
                      type="button"
                      aria-pressed={track.id === activeId && playing}
                      onClick={() => choose(track.id)}
                    >
                      <span>
                        {track.id}. {track.title}
                      </span>
                      <span className="tracks__time">{clock(track.seconds)}</span>
                    </button>
                  </li>
                ))}
              </ol>
              {active ? (
                <div className="player" role="region" aria-label="Player">
                  <div className="player__row">
                    <button className="player__play" type="button" onClick={() => setPlaying((value) => !value)}>
                      {playing ? "Pause" : "Play"}
                    </button>
                    <div className="player__meta">
                      <p className="player__title">
                        {active.id}. {active.title}
                      </p>
                      <p className="player__clock">
                        {clock(elapsed)} / {clock(active.seconds)}
                      </p>
                    </div>
                    <div className={playing ? "eq" : "eq is-paused"} aria-hidden="true">
                      <span /><span /><span /><span /><span /><span /><span /><span />
                    </div>
                  </div>
                  <div className="player__meter" aria-hidden="true">
                    <span style={{ width: `${(elapsed / active.seconds) * 100}%` }} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
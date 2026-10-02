import { useId, useState } from "react";

type ProductCardProps = {
  onOpen: () => void;
};

export function ProductCard({ onOpen }: ProductCardProps) {
  const [failed, setFailed] = useState(false);
  const grainId = useId().replace(/:/g, "");

  return (
    <article className="product" id="blonde">
      {failed ? (
        <div className="product__fallback" role="img" aria-label="BLONDE 2LP VINYL">
          <span>BLONDE</span>
          <span>2LP VINYL</span>
        </div>
      ) : (
        <button className="product__shot" type="button" onClick={onOpen} aria-label="Open BLONDE 2LP VINYL">
          <img
            className="product__photo product__photo--catalog"
            src="/blonde-vinyl.jpg"
            width={1024}
            height={1024}
            alt="BLONDE 2LP VINYL, gatefold sleeve with two records"
            onError={() => setFailed(true)}
          />
          <img
            className="product__photo product__photo--alt"
            src="/blonde-vinyl.jpg"
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
        </button>
      )}
      <div className="product__info">
        <h2 className="product__title">BLONDE</h2>
        <div className="product__description">
          <p>
            <span>2 Record Gatefold Packaging</span>
            <br />
            <span>12" x 36" Lyrics foldout</span>
            <br />
            <span>12" x 24" Foldout poster</span>
          </p>
          <p>
            <em>Please allow 2-6 weeks for fulfillment.</em>
          </p>
        </div>
        <p className="sold-out">Sold Out</p>
        <p className="versions" aria-hidden="true">
          I got two versions
        </p>
      </div>
    </article>
  );
}

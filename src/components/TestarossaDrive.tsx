import { useEffect } from "react";

interface Props {
  id: number;
  direction: "ltr" | "rtl";
  onDone: () => void;
}

export function TestarossaDrive({ direction, onDone }: Props) {
  useEffect(() => {
    // La animación dura 1.6 segundos
    const timer = setTimeout(() => {
      onDone();
    }, 1600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        top: "40%",
        left: 0,
        width: "100vw",
        zIndex: 999999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "220px",
          animation: `drive-${direction} 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
        }}
      >
        {/* Pixel Art / Vector Testarossa Rojo */}
        <svg viewBox="0 0 120 40" width="100%" height="auto" style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }}>
          {/* Cuerpo rojo Testarossa */}
          <path d="M5 28 L15 18 L40 14 L85 14 L110 24 L118 28 L115 32 L5 32 Z" fill="#e11d48" />
          {/* Ventanas / Parabrisas tintado */}
          <path d="M42 16 L65 16 L80 24 L35 24 Z" fill="#18181b" />
          {/* Rejillas laterales clásicas Testarossa */}
          <line x1="45" y1="26" x2="75" y2="26" stroke="#9f1239" strokeWidth="1.5" />
          <line x1="48" y1="28" x2="72" y2="28" stroke="#9f1239" strokeWidth="1.5" />
          {/* Luces y detalles */}
          <rect x="114" y="26" width="4" height="2" fill="#fbbf24" />
          <rect x="4" y="27" width="3" height="3" fill="#881337" />
          {/* Llantas */}
          <circle cx="28" cy="32" r="7" fill="#18181b" />
          <circle cx="28" cy="32" r="3.5" fill="#a1a1aa" />
          <circle cx="95" cy="32" r="7" fill="#18181b" />
          <circle cx="95" cy="32" r="3.5" fill="#a1a1aa" />
        </svg>
      </div>

      <style>{`
        @keyframes drive-ltr {
          0% {
            transform: translateX(-250px);
          }
          100% {
            transform: translateX(110vw);
          }
        }
      `}</style>
    </div>
  );
}
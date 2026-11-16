import { useMemo, type CSSProperties } from "react";

type Props = { petals?: number; particles?: number; className?: string };

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

function Petal({ variant }: { variant: number }) {
  // Two petal tones from the palette: burgundy rose and cream blossom.
  const fill = variant % 3 === 0 ? "var(--cream)" : "var(--burgundy)";
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <path
        d="M12 2C7 6 5 11 7.5 16.5 9 19.8 12 22 12 22s3-2.2 4.5-5.5C19 11 17 6 12 2Z"
        fill={fill}
        opacity="0.85"
      />
      <path d="M12 4v16" stroke="var(--gold)" strokeOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}

/** Floating flower petals and soft golden particles. Pure CSS, GPU friendly. */
export function Atmosphere({ petals = 10, particles = 14, className = "" }: Props) {
  const petalItems = useMemo(
    () =>
      Array.from({ length: petals }, (_, i) => ({
        left: `${Math.round(seeded(i, 1) * 100)}%`,
        size: 10 + Math.round(seeded(i, 2) * 10),
        dur: `${12 + Math.round(seeded(i, 3) * 10)}s`,
        delay: `${-Math.round(seeded(i, 4) * 20)}s`,
        drift: `${Math.round(seeded(i, 5) * 160 - 80)}px`,
        spin: `${Math.round(seeded(i, 6) * 720 - 360)}deg`,
      })),
    [petals],
  );
  const particleItems = useMemo(
    () =>
      Array.from({ length: particles }, (_, i) => ({
        left: `${Math.round(seeded(i, 7) * 100)}%`,
        bottom: `${Math.round(seeded(i, 8) * 40)}%`,
        size: 2 + Math.round(seeded(i, 9) * 3),
        dur: `${7 + Math.round(seeded(i, 10) * 8)}s`,
        delay: `${-Math.round(seeded(i, 11) * 12)}s`,
      })),
    [particles],
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {particleItems.map((p, i) => (
        <span
          key={`p${i}`}
          className="animate-particle absolute rounded-full bg-gold-light"
          style={
            {
              left: p.left,
              bottom: p.bottom,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px var(--gold)",
              "--dur": p.dur,
              "--delay": p.delay,
            } as CSSProperties
          }
        />
      ))}
      {petalItems.map((p, i) => (
        <span
          key={`f${i}`}
          className="animate-petal absolute top-0"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--dur": p.dur,
              "--delay": p.delay,
              "--drift": p.drift,
              "--spin": p.spin,
            } as CSSProperties
          }
        >
          <Petal variant={i} />
        </span>
      ))}
    </div>
  );
}

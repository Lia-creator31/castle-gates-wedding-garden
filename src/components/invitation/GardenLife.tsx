import type { CSSProperties } from "react";

import { scenery } from "./assets";
import { cn } from "@/lib/utils";

/**
 * A few quiet garden animals drawn as lightweight inline SVG silhouettes
 * (no image assets). Always decorative, never interactive, and hidden for
 * reduced-motion users.
 */
type Props = {
  birds?: number;
  butterflies?: number;
  deer?: boolean;
  /** Text color token class used by the silhouettes (currentColor). */
  tone?: string;
  className?: string;
};

const BIRD_PATHS = [
  { top: "12%", dur: "19s", delay: "-3s", size: 22, opacity: 0.7 },
  { top: "20%", dur: "24s", delay: "-14s", size: 15, opacity: 0.5 },
];

const BUTTERFLY_PATHS = [
  { left: "14%", top: "58%", dur: "17s", delay: "-2s", size: 26, alt: false },
  { left: "70%", top: "40%", dur: "21s", delay: "-9s", size: 20, alt: true },
];

function Bird({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 16" width={size} height={size * 0.4} aria-hidden>
      <g className="animate-wing-flap" style={{ transformOrigin: "20px 9px" }}>
        <path
          d="M0 6 C8 0 14 2 20 9 C26 2 32 0 40 6 C32 4 26 6 20 13 C14 6 8 4 0 6Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function Butterfly({ size }: { size: number }) {
  return (
    // Real butterfly photo; wings "beat" by a soft horizontal squeeze.
    <img
      src={scenery.butterfly}
      alt=""
      aria-hidden
      width={size}
      height={size}
      loading="lazy"
      className="animate-butterfly-flap drop-shadow-[0_4px_6px_oklch(0_0_0/0.35)]"
      style={{ width: size, height: size }}
    />
  );
}

function Deer() {
  return (
    <svg viewBox="0 0 64 56" width={46} height={40} aria-hidden className="animate-deer-bob">
      {/* antlers */}
      <path
        d="M47 13 L45 4 M45 7 L42 3 M47 13 L51 5 M50 8 L54 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* head + neck */}
      <path d="M44 13 C47 11 51 12 53 15 L56 17 C55 19 52 19 50 18 L47 27 L40 27 Z" fill="currentColor" />
      {/* body */}
      <ellipse cx="29" cy="29" rx="16" ry="7.5" fill="currentColor" />
      <path d="M13 26 C11 25 10 27 12 29Z" fill="currentColor" />
      {/* legs: pairs step in opposite phase */}
      <g className="animate-deer-step" style={{ transformOrigin: "19px 33px" }}>
        <rect x="18" y="33" width="2" height="17" rx="1" fill="currentColor" />
      </g>
      <g className="animate-deer-step-alt" style={{ transformOrigin: "23px 33px" }}>
        <rect x="22" y="33" width="2" height="17" rx="1" fill="currentColor" />
      </g>
      <g className="animate-deer-step-alt" style={{ transformOrigin: "37px 33px" }}>
        <rect x="36" y="33" width="2" height="17" rx="1" fill="currentColor" />
      </g>
      <g className="animate-deer-step" style={{ transformOrigin: "41px 33px" }}>
        <rect x="40" y="33" width="2" height="17" rx="1" fill="currentColor" />
      </g>
    </svg>
  );
}

export function GardenLife({
  birds = 2,
  butterflies = 2,
  deer = false,
  tone = "text-navy-deep",
  className,
}: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [container-type:size] motion-reduce:hidden",
        tone,
        className,
      )}
    >
      {BIRD_PATHS.slice(0, birds).map((b, i) => (
        <span
          key={`b${i}`}
          className="animate-bird-fly absolute left-0"
          style={{ top: b.top, opacity: b.opacity, "--dur": b.dur, "--delay": b.delay } as CSSProperties}
        >
          <Bird size={b.size} />
        </span>
      ))}
      {BUTTERFLY_PATHS.slice(0, butterflies).map((b, i) => (
        <span
          key={`f${i}`}
          className={cn("absolute", b.alt ? "animate-butterfly-wander-alt" : "animate-butterfly-wander")}
          style={{ left: b.left, top: b.top, "--dur": b.dur, "--delay": b.delay } as CSSProperties}
        >
          <Butterfly size={b.size} />
        </span>
      ))}
      {deer && (
        <span className="animate-deer-walk absolute bottom-[19%] left-0 opacity-45">
          <Deer />
        </span>
      )}
    </div>
  );
}

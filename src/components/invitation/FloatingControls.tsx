import { motion } from "framer-motion";

import { official } from "./assets";
import { EASE_LUX } from "./motion";
import { cn } from "@/lib/utils";

/** Floating music disc only — the invitation is one long vertical scroll, no bottom menu. */
export function FloatingControls({
  playing,
  onToggleMusic,
}: {
  playing: boolean;
  onToggleMusic: () => void;
}) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[420px] justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_LUX, delay: 0.4 }}
    >
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={playing ? "Matikan musik" : "Putar musik"}
        aria-pressed={playing}
        className="pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full bg-navy-deep/70 shadow-[var(--shadow-gold)] backdrop-blur"
      >
        <img
          src={official.disc}
          alt=""
          className={cn(
            "h-10 w-10 animate-spin-slow",
            !playing && "[animation-play-state:paused] opacity-60",
          )}
        />
        {!playing && (
          <span aria-hidden className="absolute h-0.5 w-8 rotate-45 rounded bg-cream/80" />
        )}
      </button>
    </motion.div>
  );
}

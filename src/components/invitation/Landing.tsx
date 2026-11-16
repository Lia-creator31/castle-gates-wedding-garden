import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Atmosphere } from "./Atmosphere";
import { GardenLife } from "./GardenLife";
import { official, scenery } from "./assets";
import { couple } from "./data";
import { EASE_LUX } from "./motion";

type Props = {
  guest: string;
  onOpenStart: () => void;
  /** Fired while the garden is dissolving, so the main page can begin its reveal. */
  onReveal: () => void;
  /** Fired once the opening scene has fully faded away. */
  onOpened: () => void;
};

/**
 * One continuous journey on a single clock (seconds after the tap):
 * UI fades → camera eases toward the gate → light glints along the seam →
 * doors swing open in 3D → camera glides through the doorway into the garden
 * → the garden dissolves into the main invitation. Every layer reads its
 * keyframes from the same marks so nothing drifts or snaps.
 */
const JOURNEY = 8.4;
const M = {
  uiOut: 0.9,
  approach: 1.4, // camera settles closer to the gate
  seam: 0.7, // golden glint along the seam
  doorsStart: 1.1,
  doorsDur: 3.1,
  push: 3.4, // camera starts passing through the gateway
  through: 5.9, // gate has fully left the frame
  veil: 6.4, // garden begins blending into the main page
};
const f = (s: number) => s / JOURNEY;
const T_REVEAL_MS = 6600;
const easeInOut = [0.45, 0, 0.25, 1] as const;
const doorEase = [0.6, 0.02, 0.3, 1] as const; // heavy door: slow start, long soft settle
const glide = [0.5, 0, 0.2, 1] as const;
const maskOf = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" });

export function Landing({ guest, onOpenStart, onReveal, onOpened }: Props) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  const total = reduce ? 0.8 : JOURNEY;

  function open() {
    if (opening) return;
    setOpening(true);
    onOpenStart();
    window.setTimeout(onReveal, reduce ? 200 : T_REVEAL_MS);
    window.setTimeout(onOpened, (total + 0.1) * 1000);
  }

  const journey = { duration: total, ease: "linear" as const };

  return (
    <motion.section
      aria-label="Halaman pembuka undangan"
      className="fixed inset-y-0 left-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 overflow-hidden bg-burgundy-deep"
      initial={{ opacity: 1 }}
      animate={opening ? { opacity: [1, 1, 0] } : { opacity: 1 }}
      transition={opening ? { ...journey, times: [0, reduce ? 0.2 : 0.82, 1] } : {}}
    >
      {/* Layer 1 — the garden. One uninterrupted forward camera push. */}
      <motion.img
        src={scenery.gardenBg}
        alt=""
        aria-hidden
        width={1024}
        height={1792}
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.12 }}
        animate={
          opening
            ? reduce
              ? { scale: 1.08 }
              : { scale: [1.05, 1.09, 1.4, 1.6], y: ["0%", "0%", "-2%", "-3%"] }
            : { scale: 1.05 }
        }
        transition={
          opening
            ? { ...journey, times: [0, f(M.push), f(M.veil), 1], ease: [glide, glide, "easeOut"] }
            : { duration: 8, ease: EASE_LUX }
        }
      />

      {/* Layer 2 — blurred garden edges rushing past for parallax depth. */}
      {!reduce && (
        <motion.img
          src={scenery.gardenBg}
          alt=""
          aria-hidden
          className="garden-edge-mask absolute inset-0 h-full w-full object-cover blur-[6px] brightness-75"
          initial={{ opacity: 0, scale: 1.3 }}
          animate={
            opening
              ? { opacity: [0, 0, 0.9, 0.6, 0], scale: [1.3, 1.3, 1.8, 2.6, 3] }
              : { opacity: 0, scale: 1.3 }
          }
          transition={
            opening ? { ...journey, ease: easeInOut, times: [0, f(M.push), f(M.through), f(M.veil), 1] } : {}
          }
        />
      )}

      {/* Burgundy/navy tint that lifts as golden light enters. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-navy-deep/75 via-navy-deep/15 to-navy-deep/85"
        animate={opening ? { opacity: [1, 0.85, 0.2, 0.15] } : { opacity: 1 }}
        transition={opening ? { ...journey, times: [0, f(M.doorsStart), f(M.through), 1], ease: "easeInOut" } : {}}
      />

      {/* Golden light: radial glow + slow rays pouring from the gate. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 0.15, 1, 0.7, 0.35] } : { opacity: 0 }}
        transition={opening ? { ...journey, ease: "easeInOut", times: [0, f(M.doorsStart), f(M.doorsStart + M.doorsDur * 0.8), f(M.through), 1] } : {}}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,var(--gold-light)_0%,transparent_55%)] opacity-70 mix-blend-screen" />
        {!reduce && (
          <motion.div
            className="animate-rays absolute left-1/2 top-[52%] h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            animate={opening ? { scale: [0.6, 1, 1.6] } : { scale: 0.6 }}
            transition={opening ? { ...journey, ease: "easeInOut", times: [0, f(M.doorsStart + M.doorsDur), 1] } : {}}
          >
            <div className="bg-light-rays h-full w-full" />
          </motion.div>
        )}
      </motion.div>

      {/* Soft ground mist */}
      <div
        aria-hidden
        className="animate-mist absolute inset-x-[-10%] bottom-0 h-1/3 bg-gradient-to-t from-cream/15 to-transparent blur-2xl"
      />

      {/* Garden life — appears once the guest is inside the garden. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 0, 1, 1, 0.6] } : { opacity: 0.35 }}
        transition={opening ? { ...journey, ease: "easeInOut", times: [0, f(M.push), f(M.through), f(M.veil), 1] } : { duration: 2 }}
      >
        <GardenLife birds={2} butterflies={opening ? 2 : 1} deer={opening} />
      </motion.div>

      <Atmosphere petals={opening ? 18 : 8} particles={opening ? 26 : 14} />

      {/* Final veil that blends the garden into the main invitation's burgundy. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-burgundy-gradient"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: [0, 0, 0.75] } : { opacity: 0 }}
        transition={opening ? { ...journey, ease: "easeInOut", times: [0, reduce ? 0 : f(M.veil), 1] } : {}}
      />

      <div className="relative flex h-full flex-col items-center justify-between px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))] text-center">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={opening ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
          transition={{ duration: opening ? M.uiOut : 1.1, ease: EASE_LUX, delay: opening ? 0 : 0.3 }}
          className="flex flex-col items-center"
        >
          <img
            src={official.monogram}
            alt="Monogram S&L"
            width={209}
            height={268}
            className="drop-glow h-auto w-14"
          />
          <p className="text-eyebrow mt-4 text-cream/90">The Wedding of</p>
          <h1 className="text-fluid-hero text-gold-shimmer mt-1 font-script">{couple.short}</h1>
        </motion.div>

        {/* Gate — the camera walks through it into the garden. */}
        <motion.div
          className="relative flex w-[66%] max-w-[270px] items-center justify-center"
          style={{ perspective: 1200 }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={
            opening
              ? reduce
                ? { opacity: 0, scale: 1 }
                : { opacity: [1, 1, 1, 1, 0], scale: [1, 1.1, 1.14, 2.6, 5.2], y: [0, 6, 8, 34, 60] }
              : { opacity: 1, scale: 1 }
          }
          transition={
            opening
              ? {
                  ...journey,
                  times: [0, f(M.approach), f(M.push), f(M.push + (M.through - M.push) * 0.55), f(M.through)],
                  ease: [EASE_LUX, "linear", [0.55, 0, 0.85, 0.6], "linear"],
                }
              : { duration: 1.2, ease: EASE_LUX, delay: 0.5 }
          }
        >
          {/* Garden glimpsed behind the doors */}
          <motion.div
            aria-hidden
            className="absolute inset-[8%_10%_2%] overflow-hidden rounded-t-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 1 : 0.4 }}
            transition={{ duration: M.doorsDur * 0.8, ease: "easeInOut", delay: opening ? M.doorsStart : 0 }}
          >
            <motion.img
              src={scenery.gardenBg}
              alt=""
              className="h-full w-full object-cover object-[50%_40%]"
              animate={{ scale: opening ? 1.25 : 1 }}
              transition={{ duration: M.push + 1.5 - M.doorsStart, ease: glide, delay: opening ? M.doorsStart : 0 }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--gold-light)_0%,transparent_60%)] opacity-60 mix-blend-screen" />
          </motion.div>

          {/* Official closed gate — sizes the stage; the matching door leaves
              sit exactly on top from the start, so tapping never swaps images. */}
          <img
            src={official.gateClosed}
            alt="Gerbang undangan"
            width={214}
            height={276}
            className="invisible relative z-10 h-auto w-full"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 drop-shadow-[0_20px_40px_oklch(0_0_0/0.6)]">
            <div className="absolute inset-0 flex" style={{ transformStyle: "preserve-3d" }}>
              {(["left", "right"] as const).map((side) => {
                const src = side === "left" ? official.gateLeft : official.gateRight;
                const dir = side === "left" ? -1 : 1;
                const door = { duration: reduce ? 0.3 : M.doorsDur, ease: doorEase, delay: reduce ? 0 : M.doorsStart };
                return (
                  <motion.div
                    key={side}
                    className="relative h-full w-1/2 will-change-transform"
                    style={{ transformOrigin: `${side} center`, transformStyle: "preserve-3d" }}
                    initial={false}
                    animate={opening ? { rotateY: dir * 104, z: [0, 6, 0] } : { rotateY: 0, z: 0 }}
                    transition={door}
                  >
                    <img src={src} alt="" className="h-full w-full object-fill" />
                    {/* the leaf turns away from the light as it swings */}
                    <motion.div
                      className="absolute inset-0 bg-navy-deep"
                      style={maskOf(src)}
                      initial={false}
                      animate={{ opacity: opening ? 0.55 : 0 }}
                      transition={door}
                    />
                  </motion.div>
                );
              })}
            </div>
            {/* golden glint along the seam just before the doors part */}
            {!reduce && (
              <motion.span
                className="absolute left-1/2 top-[14%] h-[80%] w-[3px] -translate-x-1/2 rounded-full bg-gold-light"
                style={{ boxShadow: "0 0 14px 4px var(--gold-light), 0 0 40px 12px var(--gold)", transformOrigin: "center" }}
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={opening ? { opacity: [0, 1, 0.9, 0], scaleY: [0.2, 1, 1, 1] } : { opacity: 0, scaleY: 0.2 }}
                transition={{ delay: M.seam, duration: 1.4, times: [0, 0.4, 0.6, 1], ease: "easeInOut" }}
              />
            )}
          </div>

          {/* Golden burst when doors open */}
          <AnimatePresence>
            {opening && !reduce && (
              <motion.div
                aria-hidden
                className="absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 18 }).map((_, i) => {
                  const angle = (i / 18) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold-light"
                      style={{ boxShadow: "0 0 10px var(--gold)" }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                      animate={{
                        x: Math.cos(angle) * (90 + (i % 3) * 30),
                        y: Math.sin(angle) * (110 + (i % 4) * 25),
                        opacity: [0, 1, 0],
                        scale: [0.4, 1.2, 0.6],
                      }}
                      transition={{ duration: 2.2, ease: EASE_LUX, delay: M.doorsStart + 0.4 + (i % 5) * 0.06 }}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Guest + Buka Undangan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={opening ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
          transition={{ duration: opening ? M.uiOut : 1, ease: EASE_LUX, delay: opening ? 0.1 : 0.7 }}
          className="flex flex-col items-center"
        >
          <p className="text-xs tracking-wide text-cream/75">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="mt-1 font-display text-2xl font-semibold text-cream">{guest}</p>
          <motion.button
            type="button"
            onClick={open}
            disabled={opening}
            aria-label="Buka Undangan"
            className="relative mt-3 grid h-32 w-32 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            animate={
              opening
                ? { scale: [1, 1.15, 1.05], filter: "drop-shadow(0 0 30px oklch(0.85 0.13 92 / 0.9))" }
                : { scale: 1 }
            }
            transition={{ duration: 0.6, ease: EASE_LUX }}
          >
            <span aria-hidden className="absolute inset-3 rounded-full bg-gold/25 blur-xl" />
            <img
              src={official.bukaUndangan}
              alt=""
              width={263}
              height={240}
              className="animate-pulse-glow relative h-auto w-full"
            />
          </motion.button>
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-gold-light/80">
            Ketuk untuk membuka
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}

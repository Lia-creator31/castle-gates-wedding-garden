import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";

import { official } from "./assets";
import { EASE_LUX, fadeUp, viewportOnce } from "./motion";
import { cn } from "@/lib/utils";

export function Divider({ className }: { className?: string }) {
  return (
    <motion.img
      src={official.divider}
      alt=""
      aria-hidden
      width={262}
      height={53}
      loading="lazy"
      initial={{ opacity: 0, scaleX: 0.4 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 1.2, ease: EASE_LUX }}
      className={cn("mx-auto h-auto w-44 select-none", className)}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn("text-center", className)}
    >
      {eyebrow && <p className="text-eyebrow mb-2 text-gold/80">{eyebrow}</p>}
      <h2 className="text-fluid-title text-gold-shimmer font-display font-semibold">{title}</h2>
      <Divider className="mt-3" />
    </motion.div>
  );
}

/** Four official corner ornaments, mirrored into each corner. */
export function CornerFrame({
  className,
  size = "w-20",
}: {
  className?: string;
  size?: string;
}) {
  const base = cn("pointer-events-none absolute h-auto select-none opacity-90", size);
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <img src={official.corner} alt="" loading="lazy" className={cn(base, "right-2 top-2")} />
      <img
        src={official.corner}
        alt=""
        loading="lazy"
        className={cn(base, "left-2 top-2 -scale-x-100")}
      />
      <img
        src={official.corner}
        alt=""
        loading="lazy"
        className={cn(base, "bottom-2 right-2 -scale-y-100")}
      />
      <img
        src={official.corner}
        alt=""
        loading="lazy"
        className={cn(base, "bottom-2 left-2 -scale-100")}
      />
    </div>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: EASE_LUX, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Subtle interactive 3D tilt that follows the pointer. */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        onPointerUp={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

import { useMemo, useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import castle from "@/assets/Castle.png.asset.json";
import floralArch from "@/assets/Gate.png.asset.json";
import flowerBush from "@/assets/flower_bush.webp";
import fountain from "@/assets/fountain.webp";
import wisteria from "@/assets/wisteria.webp";
import butterflyImg from "@/assets/butterfly.webp";
import urn from "@/assets/urn.webp";
import garland from "@/assets/garland.webp";
import { WEDDING } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;

/* A watercolor butterfly fluttering along a gentle looping path. */
export function Butterfly({ className, size = 34, path, dur = 14, delay = 0 }: { className?: string; size?: number; path: { x: number[]; y: number[] }; dur?: number; delay?: number }) {
  return (
    <motion.div
      className={`gpu pointer-events-none absolute ${className ?? ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 1, 0.9, 1], x: path.x, y: path.y, rotate: [-8, 10, -6, 12, -10, -8] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: size }}
    >
      <img src={butterflyImg} alt="" className="animate-flap w-full" style={{ animationDuration: `${0.28 + (size % 5) * 0.03}s` }} />
    </motion.div>
  );
}

/* A small flock of birds gliding across the sky. */
function Birds() {
  const birds = [
    { top: "9%", dur: 26, delay: 1.5, s: 1 },
    { top: "12%", dur: 26, delay: 2.1, s: 0.75 },
    { top: "7%", dur: 26, delay: 2.6, s: 0.6 },
    { top: "16%", dur: 34, delay: 12, s: 0.8 },
  ];
  return (
    <>
      {birds.map((b, i) => (
        <div key={i} className="animate-bird pointer-events-none absolute left-0" style={{ top: b.top, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
          <svg width={26 * b.s} height={12 * b.s} viewBox="0 0 26 12" className="animate-bird-wing text-navy/70" style={{ animationDelay: `${i * 0.12}s` }}>
            <path d="M1 6 Q7 0 13 6 Q19 0 25 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      ))}
    </>
  );
}

function Sparkles({ count = 9 }: { count?: number }) {
  const s = useMemo(() => Array.from({ length: count }, (_, i) => ({ l: 6 + ((i * 41) % 88), t: 10 + ((i * 23) % 70), d: i * 0.55, z: 3 + (i % 3) * 2 })), [count]);
  return (
    <>
      {s.map((p, i) => (
        <span key={i} className="animate-twinkle pointer-events-none absolute rounded-full bg-gold" style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.z, height: p.z, animationDelay: `${p.d}s`, boxShadow: "0 0 8px var(--gold)" }} />
      ))}
    </>
  );
}

/* Decorative watercolor bouquet for section corners. */
export function FloralCorner({ className, flip, delay = 0 }: { className?: string; flip?: boolean; delay?: number }) {
  return (
    <motion.img
      src={flowerBush}
      alt=""
      loading="lazy"
      className={`pointer-events-none absolute w-48 ${className ?? ""}`}
      style={{ scaleX: flip ? -1 : 1 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 0.95, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.4, delay, ease }}
    />
  );
}

function Layer({ x, y, className, children }: { x: MotionValue<number>; y: MotionValue<string>; className?: string; children: React.ReactNode }) {
  return (
    <motion.div className={`gpu pointer-events-none absolute inset-0 ${className ?? ""}`} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/* Core page: the palace garden with layered depth, parallax and gentle motion. */
export function GardenIntro() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yFar = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const yNear = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 16 });
  const xFar = useTransform(sx, (v) => v * -6);
  const xMid = useTransform(sx, (v) => v * -14);
  const xNear = useTransform(sx, (v) => v * -26);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
  };

  return (
    <section ref={ref} onPointerMove={onMove} onPointerLeave={() => px.set(0)} className="bg-sky relative flex h-svh flex-col items-center justify-end overflow-hidden">
      {/* FAR: sky, birds, castle */}
      <Layer x={xFar} y={yFar}>
        <span className="animate-glow absolute left-1/2 top-[6%] h-48 w-48 -translate-x-1/2 rounded-full bg-lantern" />
        <Birds />
        <motion.div className="absolute inset-0" initial={{ opacity: 0.2, scale: 1.18 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 3, ease }}>
          <img src={castle.url} alt="Castle" className="animate-kenburns h-full w-full object-cover" />
        </motion.div>
      </Layer>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream via-cream/80 to-transparent" />

      {/* MID: urns & fountain */}
      <Layer x={xMid} y={yMid}>
        <motion.img src={urn} alt="" className="absolute bottom-[17%] left-[1%] w-[22%]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 1.2, ease }} />
        <motion.img src={urn} alt="" className="absolute bottom-[17%] right-[1%] w-[22%] -scale-x-100" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 1.35, ease }} />
        <motion.div className="absolute bottom-[19%] left-1/2 w-[30%] -translate-x-1/2" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 1, ease }}>
          <img src={fountain} alt="Air mancur" className="w-full" />
          <span className="animate-mist absolute inset-x-[10%] top-[8%] h-1/2 rounded-full bg-cream/40 blur-xl" />
        </motion.div>
      </Layer>

      {/* NEAR: wisteria & flower beds */}
      <Layer x={xNear} y={yNear}>
        <motion.div className="absolute -left-[10%] -top-[3%] w-[44%]" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 0.6, ease }}>
          <img src={wisteria} alt="" className="animate-sway w-full" />
        </motion.div>
        <motion.div className="absolute -right-[10%] -top-[3%] w-[44%] -scale-x-100" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, delay: 0.8, ease }}>
          <img src={wisteria} alt="" className="animate-sway w-full [animation-delay:-3s]" />
        </motion.div>
        <motion.div className="absolute -bottom-[2%] -left-[16%] w-[62%]" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.8, delay: 0.9, ease }}>
          <img src={flowerBush} alt="" className="animate-sway-soft w-full" />
        </motion.div>
        <motion.div className="absolute -bottom-[2%] -right-[16%] w-[62%] -scale-x-100" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.8, delay: 1.05, ease }}>
          <img src={flowerBush} alt="" className="animate-sway-soft w-full [animation-delay:-2.5s]" />
        </motion.div>
      </Layer>

      <div className="pointer-events-none absolute inset-0">
        <Sparkles />
        <Butterfly className="left-[18%] top-[38%]" size={34} dur={16} delay={2} path={{ x: [0, 60, 120, 70, 10, 0], y: [0, -40, 10, 60, 30, 0] }} />
        <Butterfly className="right-[16%] top-[50%]" size={26} dur={13} delay={3} path={{ x: [0, -50, -90, -40, 10, 0], y: [0, -30, 20, -50, -10, 0] }} />
        <Butterfly className="left-[44%] top-[22%]" size={22} dur={18} delay={4.5} path={{ x: [0, 40, -30, -60, 20, 0], y: [0, 30, 60, 10, -20, 0] }} />
      </div>

      {/* Title */}
      <motion.div className="relative z-10 pb-12 text-center" style={{ y: yText, opacity: fade }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 1.6, ease }}>
          <p className="font-serif text-xs uppercase tracking-[0.4em] text-navy">We are getting married</p>
          <h2 className="mt-2 font-script text-6xl text-burgundy drop-shadow-[0_2px_8px_var(--cream)]">{WEDDING.bride.nick} & {WEDDING.groom.nick}</h2>
          <div className="divider-gold mx-auto mt-3 w-32" />
        </motion.div>
      </motion.div>

      {/* Passing through the floral arch as we arrive */}
      <motion.img
        src={floralArch.url}
        alt=""
        className="gpu pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
        style={{ transformOrigin: "50% 45%" }}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 3, delay: 0.3, ease: [0.5, 0, 0.75, 0.4] }}
      />
    </section>
  );
}

/* ---------- Light section decorations (used from the 2nd page to the end) ---------- */

/* A watercolor floral garland that drapes softly over a section edge. */
export function Garland({ className, flip, delay = 0 }: { className?: string; flip?: boolean; delay?: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute left-1/2 w-[112%] -translate-x-1/2 ${className ?? ""}`}
      initial={{ opacity: 0, y: flip ? 16 : -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.4, delay, ease }}
    >
      <img
        src={garland}
        alt=""
        loading="lazy"
        width={900}
        height={191}
        className={`animate-sway-soft w-full ${flip ? "-scale-y-100" : ""}`}
        style={{ animationDuration: "9s" }}
      />
    </motion.div>
  );
}

/* Wisteria hanging from a top corner, swaying in the breeze. */
export function WisteriaHang({ className, side = "left", delay = 0 }: { className?: string; side?: "left" | "right"; delay?: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute top-0 w-24 ${side === "left" ? "-left-5" : "-right-5"} ${className ?? ""}`}
      style={{ scaleX: side === "right" ? -1 : 1 }}
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 0.95, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.6, delay, ease }}
    >
      <img src={wisteria} alt="" loading="lazy" width={520} height={780} className="animate-sway w-full" style={{ animationDelay: side === "right" ? "-3.5s" : "0s" }} />
    </motion.div>
  );
}

/* Tiny gold twinkles scattered over a section. */
export function Sparkles({ count = 9, className }: { count?: number; className?: string }) {
  const dots = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ left: (i * 41 + 7) % 96, top: (i * 29 + 11) % 92, d: (i * 0.7) % 3, s: 3 + (i % 3) * 2 })),
    [count],
  );
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {dots.map((p, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-gold glow-gold"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.s, height: p.s, animationDelay: `${p.d}s`, animationDuration: `${3 + (i % 4)}s` }}
        />
      ))}
    </div>
  );
}

/* Fine gold filigree flourish for section corners (inline SVG, inherits text color). */
export function Filigree({ className, corner = "tl" }: { className?: string; corner?: "tl" | "tr" | "bl" | "br" }) {
  const rot = { tl: "", tr: "-scale-x-100", bl: "-scale-y-100", br: "-scale-100" }[corner];
  const pos = { tl: "left-3 top-3", tr: "right-3 top-3", bl: "bottom-3 left-3", br: "bottom-3 right-3" }[corner];
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" className={`pointer-events-none absolute h-16 w-16 text-gold opacity-80 ${pos} ${rot} ${className ?? ""}`} aria-hidden>
      <path d="M4 96 V30 Q4 4 30 4 H96" />
      <path d="M12 96 V36 Q12 12 36 12 H96" opacity=".55" />
      <path d="M22 22 q14 4 18 18 q-14 -2 -18 -18 Z" />
      <path d="M30 4 q-2 12 8 18 M4 30 q12 -2 18 8" />
      <circle cx="22" cy="22" r="2.2" fill="currentColor" />
      <path d="M52 12 q8 -8 16 0 q-8 8 -16 0 Z M12 52 q-8 8 0 16 q8 -8 0 -16 Z" opacity=".8" />
    </svg>
  );
}

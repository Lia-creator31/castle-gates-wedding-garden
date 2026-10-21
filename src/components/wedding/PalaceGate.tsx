import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import gateFrame from "@/assets/gate_frame.webp";
import doorLeft from "@/assets/gate_door_left.webp";
import doorRight from "@/assets/gate_door_right.webp";
import { WEDDING } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;
const inOut = [0.65, 0, 0.35, 1] as const;

/* Doorway position inside the gate artwork (percent of the 1088x1920 image). */
const DOOR = { left: 29.6, seam: 50.09, right: 70.04, top: 30.47, bottom: 77.97 };
/* Camera focus point (the doorway centre) — shared with the garden behind the gate. */
export const GATE_ORIGIN = "50% 54.2%";
const ORIGIN = GATE_ORIGIN;
const maskOf = (src: string) => ({ maskImage: `url(${src})`, WebkitMaskImage: `url(${src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" });

/* Cinematic timeline (seconds after "Buka Undangan" is tapped).
   The real garden page (GardenIntro) is mounted behind the gate at t=0 and
   follows this same timeline, so the doors open onto the actual garden. */
export const GATE_T = {
  textOut: 0.9,
  approach: 2.2, // camera glides toward the gate
  seamStart: 1.2, // light leaks through the seam
  doorsStart: 2.0,
  doorsDur: 3.2,
  pushStart: 4.3, // camera passes through the doorway
  pushDur: 3.4,
  archStart: 5.4, // camera passes through the floral arch in the garden
  archDur: 3.0,
  titleIn: 7.2, // names appear once we have arrived
  done: 7.8,
};
const T = GATE_T;

export function PalaceGate({ guest, onOpen, onDone }: { guest: string | null; onOpen: () => void; onDone: () => void }) {
  const reduce = useReducedMotion();
  const k = reduce ? 0.3 : 1;
  const [enter, setEnter] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = () => {
    if (enter) return;
    setEnter(true);
    onOpen();
    timer.current = setTimeout(onDone, T.done * 1000 * k);
  };

  const dust = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ left: 8 + ((i * 53) % 84), bottom: 4 + ((i * 29) % 30), dur: 7 + (i % 5) * 1.6, delay: i * 0.7, size: 2 + (i % 3) })),
    [],
  );

  const gateTotal = T.pushStart + T.pushDur;
  const at = (s: number, total: number) => s / total;

  return (
    <motion.section
      /* Once entering, the section turns see-through: the garden page itself is
         what shows through the doorway (no separate "behind the gate" picture). */
      className={`fixed inset-0 z-50 mx-auto max-w-md overflow-hidden ${enter ? "" : "bg-cream"}`}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.6 * k, ease }}
      aria-label="Gerbang istana"
    >
      <div className="stage-cover">
        {/* Gate — near layer: approach, doors open, camera passes through */}
        <motion.div
          className="gpu absolute inset-0"
          style={{ transformOrigin: ORIGIN, perspective: 1300 }}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={
            enter
              ? { scale: [1, 1.15, 1.17, 5.2], opacity: [1, 1, 1, 0] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            enter
              ? {
                  duration: gateTotal * k,
                  times: [0, at(T.approach, gateTotal), at(T.pushStart, gateTotal), 1],
                  ease: [ease, "linear", [0.6, 0, 0.9, 0.55]],
                  opacity: { duration: gateTotal * k, times: [0, 0.5, 0.86, 1] },
                }
              : { duration: 2.4, ease }
          }
        >
          {/* warm light pouring through the doorway */}
          <motion.div
            className="bg-doorlight absolute"
            style={{ left: `${DOOR.left}%`, top: `${DOOR.top}%`, width: `${DOOR.right - DOOR.left}%`, height: `${DOOR.bottom - DOOR.top}%` }}
            initial={{ opacity: 0 }}
            animate={enter ? { opacity: [0, 0.95, 0.5, 0] } : { opacity: 0 }}
            transition={{ delay: T.doorsStart * k, duration: (T.doorsDur + 1.6) * k, times: [0, 0.3, 0.65, 1] }}
          />

          {/* Door leaves swing inward on their hinges */}
          <motion.div
            className="gpu absolute"
            style={{ left: `${DOOR.left}%`, top: `${DOOR.top}%`, width: `${DOOR.seam - DOOR.left}%`, height: `${DOOR.bottom - DOOR.top}%`, transformOrigin: "left center" }}
            animate={enter ? { rotateY: 100 } : { rotateY: 0 }}
            transition={{ delay: T.doorsStart * k, duration: T.doorsDur * k, ease: inOut }}
          >
            <img src={doorLeft} alt="" className="h-full w-full" />
            <motion.div className="absolute inset-0 bg-navy" style={maskOf(doorLeft)} initial={{ opacity: 0 }} animate={{ opacity: enter ? 0.55 : 0 }} transition={{ delay: T.doorsStart * k, duration: T.doorsDur * k }} />
          </motion.div>
          <motion.div
            className="gpu absolute"
            style={{ left: `${DOOR.seam}%`, top: `${DOOR.top}%`, width: `${DOOR.right - DOOR.seam}%`, height: `${DOOR.bottom - DOOR.top}%`, transformOrigin: "right center" }}
            animate={enter ? { rotateY: -100 } : { rotateY: 0 }}
            transition={{ delay: T.doorsStart * k, duration: T.doorsDur * k, ease: inOut }}
          >
            <img src={doorRight} alt="" className="h-full w-full" />
            <motion.div className="absolute inset-0 bg-navy" style={maskOf(doorRight)} initial={{ opacity: 0 }} animate={{ opacity: enter ? 0.55 : 0 }} transition={{ delay: T.doorsStart * k, duration: T.doorsDur * k }} />
          </motion.div>

          {/* Palace facade (doorway cut out so the doors swing behind the stone) */}
          <img src={gateFrame} alt="Gerbang istana" className="absolute inset-0 h-full w-full" width={1088} height={1920} />

          {/* Lantern glow */}
          <span className="bg-lantern animate-glow absolute h-[9%] w-[16%] rounded-full" style={{ left: "5.8%", top: "43.6%" }} />
          <span className="bg-lantern animate-glow absolute h-[9%] w-[16%] rounded-full [animation-delay:1.3s]" style={{ left: "77.5%", top: "43.6%" }} />

          {/* Golden seam of light before the doors part */}
          <motion.span
            className="seam-glow absolute w-[0.45%] rounded-full"
            style={{ left: `${DOOR.seam - 0.22}%`, top: `${DOOR.top + 3}%`, height: `${DOOR.bottom - DOOR.top - 4}%`, transformOrigin: "center" }}
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={enter ? { opacity: [0, 1, 1, 0], scaleY: [0.2, 1, 1, 1] } : { opacity: 0, scaleY: 0.2 }}
            transition={{ delay: T.seamStart * k, duration: 2.4 * k, times: [0, 0.4, 0.6, 1] }}
          />

          {/* Soft sheen gliding across the gilded doors */}
          <div
            className="pointer-events-none absolute overflow-hidden"
            style={{ left: `${DOOR.left}%`, top: `${DOOR.top - 3}%`, width: `${DOOR.right - DOOR.left}%`, height: `${DOOR.bottom - DOOR.top + 3}%` }}
          >
            <div className="bg-sheen animate-sheen absolute inset-y-0 w-1/2" />
          </div>
        </motion.div>
      </div>

      {/* Floating gold dust */}
      <div className="pointer-events-none absolute inset-0">
        {dust.map((d, i) => (
          <span
            key={i}
            className="animate-dust absolute rounded-full bg-gold"
            style={{ left: `${d.left}%`, bottom: `${d.bottom}%`, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, boxShadow: "0 0 6px var(--gold)" }}
          />
        ))}
      </div>

      {/* Full-screen bloom of light as we arrive in the garden */}
      <motion.div
        className="bg-doorlight pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={enter ? { opacity: [0, 0.35, 0] } : { opacity: 0 }}
        transition={{ delay: (T.doorsStart + 0.6) * k, duration: 2.6 * k }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cream"
        initial={{ opacity: 0 }}
        animate={{ opacity: enter ? 1 : 0 }}
        transition={{ delay: T.bloomStart * k, duration: 0.9 * k, ease }}
      />

      {/* Invitation card */}
      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={enter ? { opacity: 0, y: -14, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
        transition={enter ? { duration: T.textOut * k, ease } : { duration: 1.2, delay: 0.6, ease }}
        style={{ pointerEvents: enter ? "none" : "auto" }}
      >
        <div className="cover-veil flex flex-col items-center rounded-full px-10 py-14">
          <p className="font-serif text-sm uppercase tracking-[0.35em] text-navy">The Wedding of</p>
          <h1 className="mt-3 font-script text-6xl leading-tight text-burgundy">
            {WEDDING.bride.nick}
            <span className="block text-4xl text-lilac">&</span>
            {WEDDING.groom.nick}
          </h1>
          <p className="mt-3 font-serif text-lg tracking-[0.3em] text-navy">{WEDDING.dateShort}</p>
          {guest && (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">Kepada Yth. Bapak/Ibu/Saudara/i</p>
              <p className="mt-1 font-serif text-xl font-semibold text-navy">{guest}</p>
            </div>
          )}
          <button
            onClick={start}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm tracking-wide text-primary-foreground shadow-soft transition hover:scale-105"
          >
            <Mail className="h-4 w-4" /> Buka Undangan
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}

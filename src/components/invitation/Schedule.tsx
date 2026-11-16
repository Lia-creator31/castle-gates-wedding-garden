import { motion, useScroll, useTransform } from "framer-motion";
import { MapPinned } from "lucide-react";
import { useRef } from "react";

import { official } from "./assets";
import { events } from "./data";
import { EASE_LUX, viewportOnce } from "./motion";
import { SectionHeading, TiltCard } from "./Ornaments";
import { Button } from "@/components/ui/button";

function TimelineDot({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute -left-[1.6rem] top-8 grid h-4 w-4 place-items-center rounded-full border border-gold bg-navy-deep"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, ease: EASE_LUX, delay }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" />
    </motion.span>
  );
}

export function Schedule() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="acara" className="bg-night relative overflow-hidden px-5 pb-16 pt-14">
      <SectionHeading eyebrow="Save the Date" title="Jadwal Acara" />

      <motion.img
        src={official.calendar}
        alt="Kalender 18 & 20 Desember"
        width={219}
        height={240}
        loading="lazy"
        className="mx-auto mt-6 h-auto w-28 drop-shadow-[0_18px_30px_oklch(0_0_0/0.5)]"
        initial={{ opacity: 0, rotate: -8, y: 20 }}
        whileInView={{ opacity: 1, rotate: 0, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 1, ease: EASE_LUX }}
      />

      <div ref={ref} className="relative mt-8 pl-8">
        {/* Animated vertical timeline */}
        <div aria-hidden className="absolute bottom-4 left-[0.45rem] top-4 w-px bg-gold/15" />
        <motion.div
          aria-hidden
          style={{ scaleY: lineScale }}
          className="bg-gold absolute bottom-4 left-[0.45rem] top-4 w-px origin-top"
        />

        {/* Akad Nikah */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUX }}
        >
          <TimelineDot />
          <TiltCard>
            <article className="card-lux-burgundy relative overflow-hidden px-5 pb-4 pt-5 text-center">
              <p className="text-eyebrow text-gold-light">{events.akad.title}</p>
              <div className="mx-auto my-3 h-px w-24 bg-gold/40" />
              <p className="font-display text-base italic text-cream/80">({events.akad.note})</p>
              <p className="mt-1 font-display text-2xl font-semibold text-cream">
                {events.akad.date}
              </p>
              <img
                src={official.akad}
                alt="Ikon Akad Nikah"
                width={222}
                height={230}
                loading="lazy"
                className="mx-auto mt-3 h-auto w-24"
                style={{ transform: "translateZ(30px)" }}
              />
            </article>
          </TiltCard>
        </motion.div>

        {/* Resepsi */}
        <motion.div
          className="relative mt-8"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: EASE_LUX, delay: 0.1 }}
        >
          <TimelineDot delay={0.2} />
          <TiltCard>
            <article className="card-lux relative overflow-hidden px-5 pb-6 pt-5 text-center">
              <img
                src={official.resepsi}
                alt="Ikon Resepsi"
                width={229}
                height={207}
                loading="lazy"
                className="mx-auto h-auto w-24"
                style={{ transform: "translateZ(30px)" }}
              />
              <p className="text-eyebrow mt-3 text-gold-light">{events.resepsi.title}</p>
              <div className="mx-auto my-3 h-px w-24 bg-gold/40" />
              <p className="font-display text-2xl font-semibold text-cream">
                {events.resepsi.date}
              </p>
              <div className="mt-4 flex items-start justify-center gap-2">
                <img
                  src={official.mapPin}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="mt-0.5 h-auto w-8 shrink-0"
                />
                <div className="min-w-0 text-left">
                  <p className="font-display text-lg font-semibold leading-snug text-gold-light">
                    {events.resepsi.venue}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-cream/75">
                    {events.resepsi.address}
                  </p>
                </div>
              </div>
              <Button asChild variant="gold" size="pill" className="mt-5">
                <a href={events.resepsi.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPinned /> Buka Peta
                </a>
              </Button>
            </article>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

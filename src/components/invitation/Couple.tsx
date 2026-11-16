import { motion } from "framer-motion";
import { Camera } from "lucide-react";

import { GardenLife } from "./GardenLife";
import { official, scenery } from "./assets";
import { couplePeople, type CouplePerson } from "./data";
import { EASE_LUX, fadeUp, viewportOnce } from "./motion";
import { Divider, SectionHeading } from "./Ornaments";

function Portrait({ person }: { person: CouplePerson }) {
  return (
    <div className="gold-frame relative aspect-[4/5] w-full overflow-hidden rounded-t-full shadow-[var(--shadow-card)]">
      {person.photo ? (
        <img
          src={person.photo}
          alt={`Foto ${person.name}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-navy-gradient">
          <img src={official.emblem} alt="" aria-hidden loading="lazy" className="h-auto w-20 opacity-25" />
          <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-gold-light/80">
            <Camera className="h-3.5 w-3.5" aria-hidden /> Foto {person.name}
          </span>
        </div>
      )}
    </div>
  );
}

function PersonBlock({ person, delay = 0 }: { person: CouplePerson; delay?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.2, ease: EASE_LUX, delay }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-[86%]">
        <Portrait person={person} />
      </div>
      <p className="text-eyebrow mt-6 text-gold/85">{person.label}</p>
      <h3 className="font-script text-[3rem] leading-tight text-gold-shimmer">{person.name}</h3>
      <p className="mt-1 max-w-[300px] font-display text-base italic leading-snug text-cream/85">
        {person.childOf} Bapak {person.father ?? "[Nama Ayah]"} &amp; Ibu {person.mother ?? "[Nama Ibu]"}
      </p>
    </motion.article>
  );
}

/** "The Bride & The Groom" — a dedicated section with large portraits. */
export function Couple() {
  const { groom, bride } = couplePeople;
  return (
    <section
      id="mempelai"
      aria-label="The Bride & The Groom"
      className="relative isolate mt-14 overflow-hidden py-14"
    >
      {/* Soft real-garden backdrop, consistent with the opening */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
        <img
          src={scenery.gardenBg}
          alt=""
          loading="lazy"
          width={1024}
          height={1792}
          className="h-full w-full object-cover object-[50%_55%] opacity-30 blur-[2px]"
        />
        <div className="absolute inset-0 bg-burgundy-deep/70" />
      </div>
      <GardenLife birds={1} butterflies={2} tone="text-navy-deep" className="opacity-80" />

      <div className="relative px-6">
        <SectionHeading eyebrow="Mempelai Kami" title="The Bride & The Groom" />
        <div className="mt-10 flex flex-col gap-12">
          <PersonBlock person={bride} />
          <motion.img
            src={official.monogram}
            alt=""
            aria-hidden
            loading="lazy"
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE_LUX }}
            className="drop-glow mx-auto h-auto w-12"
          />
          <PersonBlock person={groom} delay={0.1} />
        </div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <Divider className="mt-10" />
        </motion.div>
      </div>
    </section>
  );
}

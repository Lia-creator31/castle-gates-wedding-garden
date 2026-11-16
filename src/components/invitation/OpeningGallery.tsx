import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import { Couple } from "./Couple";
import { GalleryModal } from "./GalleryModal";
import { GardenLife } from "./GardenLife";
import { PhotoFace } from "./PhotoFace";
import { official, scenery } from "./assets";
import { couple, galleryPhotos, verse } from "./data";
import { EASE_LUX, fadeUp, stagger } from "./motion";
import { Divider, SectionHeading } from "./Ornaments";
import { cn } from "@/lib/utils";

// Editorial 6-column layout: one featured photo + seven supporting frames.
const SLOT_LAYOUT = [
  "col-span-4 row-span-2",
  "col-span-2",
  "col-span-2",
  "col-span-3",
  "col-span-3",
  "col-span-2 row-span-2",
  "col-span-4",
  "col-span-4",
];

export function OpeningGallery({ ready = true }: { ready?: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const floralY = useTransform(scrollYProgress, [0, 1], [40, -60]);

  return (
    <section
      id="pembuka"
      ref={ref}
      className="relative overflow-hidden bg-burgundy-gradient pb-16 pt-14"
    >
      {/* Same real garden as the opening, fading softly into the page. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <motion.img
          src={scenery.gardenBg}
          alt=""
          width={1024}
          height={1792}
          style={{ y: floralY }}
          className="h-[620px] w-full object-cover object-[50%_35%] opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/30 via-burgundy/60 to-burgundy" />
      </div>

      <GardenLife birds={2} butterflies={2} tone="text-navy-deep" className="opacity-80" />

      {/* Pembuka — staggers in only once the garden has dissolved */}
      <motion.div
        variants={stagger(0.18, 0.15)}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        className="relative px-7 text-center"
      >
        <motion.img
          variants={fadeUp}
          src={official.monogram}
          alt="Monogram S&L"
          width={209}
          height={268}
          loading="lazy"
          className="drop-glow mx-auto h-auto w-16"
        />
        <motion.p variants={fadeUp} className="text-eyebrow mt-5 text-cream/85">
          The Wedding of
        </motion.p>
        <motion.h2 variants={fadeUp} className="text-fluid-script text-gold-shimmer font-script">
          {couple.short}
        </motion.h2>
        <motion.div variants={fadeUp}>
          <Divider className="my-5" />
        </motion.div>
        <motion.p
          variants={fadeUp}
          dir="rtl"
          lang="ar"
          className="font-arabic text-xl leading-[2.1] text-gold-light"
        >
          {verse.arabic}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mt-4 font-display text-[1.05rem] italic leading-relaxed text-cream/90"
        >
          {verse.translation}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-3 font-script text-2xl text-gold">
          {verse.ref}
        </motion.p>
      </motion.div>

      {/* The Bride & The Groom */}
      <Couple />

      {/* Our Gallery */}
      <div className="relative mx-4 mt-14 rounded-3xl bg-navy/70 px-4 pb-6 pt-10 backdrop-blur-sm card-lux">
        <SectionHeading eyebrow="Kisah Kami" title="Our Gallery" />
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-6 grid grid-cols-6 gap-2 [grid-auto-rows:clamp(78px,22vw,96px)]"
        >
          {galleryPhotos.map((photo, i) => (
            <motion.button
              key={photo.id}
              type="button"
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: EASE_LUX } },
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(i)}
              aria-label={`Buka foto ${photo.id}: ${photo.title}`}
              className={cn(
                "gold-frame group relative overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold",
                SLOT_LAYOUT[i],
              )}
            >
              <div className="h-full w-full transition-transform duration-700 group-hover:scale-110">
                <PhotoFace photo={photo} large={i === 0} />
              </div>
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 to-transparent px-2 pb-1.5 pt-6 text-left font-display text-sm text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.title}
              </span>
            </motion.button>
          ))}
        </motion.div>
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-cream/70">
          <img src={official.swipeHand} alt="" aria-hidden loading="lazy" className="h-6 w-auto" />
          Ketuk foto untuk melihat cerita
        </div>
      </div>

      <GalleryModal photos={galleryPhotos} index={active} onChange={setActive} />
    </section>
  );
}

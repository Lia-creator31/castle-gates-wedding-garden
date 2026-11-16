import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { official } from "./assets";
import type { GalleryPhoto } from "./data";
import { EASE_LUX } from "./motion";
import { PhotoFace } from "./PhotoFace";

type Props = {
  photos: GalleryPhoto[];
  index: number | null;
  onChange: (i: number | null) => void;
};

export function GalleryModal({ photos, index, onChange }: Props) {
  const [dir, setDir] = useState(0);
  const open = index !== null;
  const photo = index !== null ? photos[index] : undefined;

  function go(delta: number) {
    if (index === null) return;
    setDir(delta);
    onChange((index + delta + photos.length) % photos.length);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  });

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  }

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          key="backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/85 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_LUX }}
          onClick={() => onChange(null)}
        >
          <motion.div
            className="relative w-full max-w-[380px]"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_LUX }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label="Tutup"
              className="bg-gold absolute -right-2 -top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-primary-foreground shadow-[var(--shadow-gold)] transition-transform active:scale-90"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="card-lux overflow-hidden p-2">
              <div className="gold-frame relative aspect-[4/5] overflow-hidden rounded-lg">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <motion.div
                    key={photo.id}
                    custom={dir}
                    className="absolute inset-0 touch-pan-y"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={onDragEnd}
                    initial={{ opacity: 0, x: dir * 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -80 }}
                    transition={{ duration: 0.6, ease: EASE_LUX }}
                  >
                    <PhotoFace photo={photo} large />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="px-3 pb-3 pt-4 text-center">
                <p className="text-eyebrow text-gold/80">
                  {String(photo.id).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-gold-light">
                  {photo.title}
                </h3>
                <p className="mt-2 font-display text-base italic leading-relaxed text-cream/85">
                  {photo.story}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto sebelumnya"
                className="grid h-12 w-14 place-items-center transition-transform active:scale-90"
              >
                <img src={official.arrowLeft} alt="" className="h-9 w-auto drop-glow" />
              </button>
              <div className="flex gap-1.5">
                {photos.map((p, i) => (
                  <span
                    key={p.id}
                    className={
                      i === index
                        ? "h-1.5 w-5 rounded-full bg-gold transition-all"
                        : "h-1.5 w-1.5 rounded-full bg-cream/30 transition-all"
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Foto berikutnya"
                className="grid h-12 w-14 place-items-center transition-transform active:scale-90"
              >
                <img src={official.arrowRight} alt="" className="h-9 w-auto drop-glow" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

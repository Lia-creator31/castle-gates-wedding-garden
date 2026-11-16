import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { EASE_LUX } from "./motion";
import { SectionHeading } from "./Ornaments";
import {
  NAME_MAX_LENGTH,
  WISH_MAX_LENGTH,
  addWish,
  createWish,
  seedWishes,
  timeAgo,
  validateWish,
  type Wish,
} from "./wishes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CONFETTI_COLORS = ["var(--gold)", "var(--gold-light)", "var(--cream)", "var(--burgundy)"];

function Confetti({ burst }: { burst: number }) {
  return (
    <AnimatePresence>
      {burst > 0 && (
        <motion.div
          key={burst}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 26 }).map((_, i) => {
            const angle = -Math.PI / 2 + ((i / 25) - 0.5) * Math.PI * 1.1;
            const dist = 90 + (i % 5) * 22;
            return (
              <motion.span
                key={i}
                className={cn("absolute h-2 w-1.5", i % 3 === 0 ? "rounded-full" : "rounded-[1px]")}
                style={{ background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: [0, Math.sin(angle) * dist, Math.sin(angle) * dist + 80],
                  opacity: [1, 1, 0],
                  rotate: (i % 2 ? 1 : -1) * 360,
                }}
                transition={{ duration: 1.5, ease: EASE_LUX }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Guestbook() {
  const [wishes, setWishes] = useState<Wish[]>(() => seedWishes(0));
  const [now, setNow] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Seed timestamps on the client to avoid server/client time mismatches.
  useEffect(() => {
    const t = Date.now();
    setWishes(seedWishes(t));
    setNow(t);
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = validateWish({ name, message });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    const wish = createWish(result.value);
    setWishes((list) => addWish(list, wish));
    setNow(Date.now());
    setMessage("");
    setBurst((b) => b + 1);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setBurst(0), 1700);
  }

  const remaining = WISH_MAX_LENGTH - message.length;

  return (
    <section id="ucapan" className="bg-night relative overflow-hidden px-4 pb-16 pt-14">
      <SectionHeading eyebrow="Doa & Restu" title="Kartu Ucapan & Doa" />
      <p className="mx-auto mt-3 max-w-[300px] text-center text-sm text-cream/70">
        Kirimkan ucapan dan doa terbaik untuk kedua mempelai.
      </p>

      <div
        ref={listRef}
        className="no-scrollbar relative mt-6 max-h-[400px] overflow-y-auto rounded-2xl"
        aria-live="polite"
      >
        <div className="columns-2 gap-3">
          <AnimatePresence initial={false}>
            {wishes.map((w, i) => (
              <motion.article
                key={w.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.9, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.8, ease: EASE_LUX, delay: Math.min(i, 4) * 0.04 }}
                className={cn(
                  "mb-3 break-inside-avoid p-3.5",
                  i % 3 === 0 ? "card-lux-burgundy" : "card-lux",
                )}
              >
                <p className="font-display text-[0.95rem] leading-snug text-cream/90">
                  {w.message}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="bg-gold grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold text-primary-foreground">
                    {w.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-gold-light">{w.name}</p>
                    <p className="text-[0.6rem] text-cream/50">
                      {now ? timeAgo(w.createdAt, now) : "\u00a0"}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="card-lux-burgundy relative mt-5 space-y-3 p-4"
        noValidate
      >
        <Confetti burst={burst} />
        <label className="sr-only" htmlFor="wish-name">
          Nama Anda
        </label>
        <input
          id="wish-name"
          className="field-lux"
          placeholder="Nama Anda"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <label className="sr-only" htmlFor="wish-message">
          Tulis ucapan atau doa
        </label>
        <div className="relative">
          <textarea
            id="wish-message"
            className="field-lux min-h-[110px] resize-none pb-7"
            placeholder="Tulis Ucapan/Doa…"
            value={message}
            maxLength={WISH_MAX_LENGTH}
            onChange={(e) => setMessage(e.target.value)}
          />
          <span
            className={cn(
              "absolute bottom-2.5 right-3 text-[0.65rem] tabular-nums transition-colors",
              remaining <= 20 ? "text-gold" : "text-cream/50",
            )}
          >
            {message.length}/{WISH_MAX_LENGTH}
          </span>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-gold-light"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <Button type="submit" variant="gold" size="pill" className="w-full">
          <Send /> Kirim Ucapan
        </Button>
      </form>
    </section>
  );
}

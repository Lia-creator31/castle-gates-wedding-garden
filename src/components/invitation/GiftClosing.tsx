import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Gift, Landmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { official, scenery } from "./assets";
import { couple, gifts } from "./data";
import { EASE_LUX, fadeUp, stagger, viewportOnce } from "./motion";
import { Reveal, SectionHeading, TiltCard } from "./Ornaments";
import { Button } from "@/components/ui/button";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  async function onClick() {
    const ok = await copyText(value);
    if (ok) {
      setCopied(true);
      toast.success(done);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Gagal menyalin, silakan salin manual.");
    }
  }
  return (
    <Button variant="gold" size="pillSm" onClick={onClick} aria-label={label} className="min-w-[132px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE_LUX }}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? "Tersalin" : label}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export function GiftClosing() {
  return (
    <section id="kado" className="bg-navy-gradient relative overflow-hidden px-5 pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-14">
      <SectionHeading eyebrow="Tanda Kasih" title="Kado Digital" />
      <Reveal className="mx-auto mt-3 max-w-[310px] text-center text-sm leading-relaxed text-cream/70">
        Doa restu Anda adalah karunia terindah. Namun jika ingin memberikan tanda kasih, dapat
        melalui:
      </Reveal>

      <motion.div
        variants={stagger(0.14)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-6 space-y-4"
      >
        {gifts.accounts.map((acc) => (
          <motion.div key={acc.number} variants={fadeUp}>
            <TiltCard>
              <article className="card-lux relative overflow-hidden p-5">
                <div
                  aria-hidden
                  className="bg-gold absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 blur-xl"
                />
                <div className="flex items-center gap-2 text-gold-light">
                  <Landmark className="h-4 w-4" aria-hidden />
                  <p className="text-sm font-semibold tracking-wide">
                    {acc.bank} <span className="font-normal text-cream/70">({acc.holder})</span>
                  </p>
                </div>
                <p className="mt-3 font-sans text-2xl font-medium tracking-[0.14em] text-cream tabular-nums">
                  {acc.number}
                </p>
                <p className="text-xs text-cream/60">a.n. {acc.holder}</p>
                <div className="mt-4 flex justify-end">
                  <CopyButton
                    value={acc.number}
                    label="Salin No. Rek"
                    done={`No. rekening ${acc.bank} tersalin`}
                  />
                </div>
              </article>
            </TiltCard>
          </motion.div>
        ))}

        <motion.div variants={fadeUp}>
          <article className="card-lux-burgundy p-5">
            <div className="flex items-center gap-2 text-gold-light">
              <Gift className="h-4 w-4" aria-hidden />
              <p className="text-sm font-semibold tracking-wide">Alamat Pengiriman Kado</p>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <img src={official.mapPin} alt="" aria-hidden loading="lazy" className="h-auto w-7 shrink-0" />
              <p className="text-sm leading-relaxed text-cream/85">{gifts.address}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <CopyButton value={gifts.address} label="Salin Alamat" done="Alamat tersalin" />
            </div>
          </article>
        </motion.div>
      </motion.div>

      {/* Closing */}
      <div className="relative isolate mt-16 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-x-[-1.25rem] -bottom-16 top-[-2rem] -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
          <img
            src={scenery.gardenBg}
            alt=""
            loading="lazy"
            width={1024}
            height={1792}
            className="h-full w-full object-cover object-[50%_80%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/60 to-navy-deep/30" />
        </div>
        <Reveal>
          <p className="mx-auto max-w-[320px] font-display text-lg italic leading-relaxed text-cream/85">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
            berkenan hadir dan memberikan doa restu.
          </p>
          <p className="mt-4 text-sm text-cream/70">Terima kasih atas segala doa dan perhatiannya.</p>
          <p className="mt-1 font-display text-base text-gold-light">
            Wassalamu’alaikum Warahmatullahi Wabarakatuh
          </p>
        </Reveal>
        <motion.img
          src={official.emblem}
          alt="Emblem S&L"
          width={164}
          height={164}
          loading="lazy"
          className="drop-glow relative mx-auto mt-10 h-auto w-32"
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1.4, ease: EASE_LUX }}
        />
        <Reveal delay={0.2} className="relative">
          <p className="mt-5 font-script text-3xl text-cream/90">The Wedding of</p>
          <p className="text-fluid-script text-gold-shimmer font-script">{couple.short}</p>
        </Reveal>
      </div>
    </section>
  );
}

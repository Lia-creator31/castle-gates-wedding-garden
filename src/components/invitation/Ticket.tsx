import { AnimatePresence, motion } from "framer-motion";
import { Download, Info, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { official } from "./assets";
import { couple, events, ticket } from "./data";
import { EASE_LUX } from "./motion";
import { SectionHeading, TiltCard } from "./Ornaments";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tier = "vip" | "reguler";

const TIERS: Record<Tier, { label: string; sub: string; badge: string; asset: string }> = {
  vip: { label: "VIP (Emas)", sub: "VIP", badge: "Tamu Kehormatan", asset: official.ticketVip },
  reguler: {
    label: "Reguler (Silver)",
    sub: "REGULER",
    badge: "Tamu Undangan",
    asset: official.ticketReguler,
  },
};

export function Ticket({ guest }: { guest: string }) {
  const [tier, setTier] = useState<Tier>("vip");
  const [detail, setDetail] = useState(false);
  const [busy, setBusy] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const t = TIERS[tier];
  const gold = tier === "vip";
  const qrValue = `SHIHAB-LIA|E-TICKET#${ticket.code}|${guest}|${t.sub}`;

  async function download() {
    if (!ticketRef.current || busy) return;
    setBusy(true);
    try {
      const { toPng } = await import("html-to-image");
      const node = ticketRef.current;
      const opts = { pixelRatio: 3, cacheBust: true, backgroundColor: "#0A1526" };
      let dataUrl: string;
      try {
        dataUrl = await toPng(node, opts);
      } catch {
        dataUrl = await toPng(node, { ...opts, skipFonts: true });
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `E-Ticket-${ticket.code}-${guest.replace(/\s+/g, "-")}-${t.sub}.png`;
      a.click();
      toast.success("Tiket berhasil diunduh");
    } catch {
      toast.error("Gagal mengunduh tiket. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="tiket" className="bg-navy-gradient relative overflow-hidden px-5 pb-16 pt-14">
      <SectionHeading eyebrow="Akses Masuk" title="Wedding Barcode" />

      {/* Tier selector */}
      <div
        role="tablist"
        aria-label="Jenis tiket"
        className="relative isolate mx-auto mt-6 grid max-w-[320px] grid-cols-2 rounded-full border border-gold/40 bg-navy-deep/60 p-1"
      >
        {(Object.keys(TIERS) as Tier[]).map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tier === k}
            onClick={() => setTier(k)}
            className={cn(
              "relative z-10 h-10 rounded-full text-xs font-semibold tracking-wide transition-colors duration-500",
              tier === k ? "text-primary-foreground" : "text-cream/70",
            )}
          >
            {tier === k && (
              <motion.span
                layoutId="tier-pill"
                className={cn("absolute inset-0 -z-10 rounded-full", k === "vip" ? "bg-gold" : "bg-silver")}
                transition={{ duration: 0.6, ease: EASE_LUX }}
              />
            )}
            {TIERS[k].label}
          </button>
        ))}
      </div>

      {/* Ticket */}
      <TiltCard className="mx-auto mt-7 max-w-[340px]" max={6}>
        <div ref={ticketRef} className="rounded-[1.4rem] bg-navy-deep p-[2px]">
          <motion.div
            className={cn(
              "relative overflow-hidden rounded-[1.3rem] p-[1.5px] transition-[background] duration-700",
              gold ? "bg-gold" : "bg-silver",
            )}
            layout
          >
            <div className="relative overflow-hidden rounded-[1.25rem] bg-navy px-5 pb-6 pt-5 text-center">
              {/* metallic sheen */}
              <motion.div
                aria-hidden
                key={tier}
                className={cn(
                  "pointer-events-none absolute inset-0 opacity-20",
                  gold ? "bg-gold" : "bg-silver",
                )}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.4, ease: EASE_LUX }}
                style={{ maskImage: "linear-gradient(100deg, transparent 30%, black 50%, transparent 70%)" }}
              />

              <AnimatePresence mode="wait">
                <motion.img
                  key={tier}
                  src={t.asset}
                  alt={`Tiket ${t.sub}`}
                  width={262}
                  height={156}
                  className="relative mx-auto h-auto w-40 drop-shadow-[0_10px_20px_oklch(0_0_0/0.5)]"
                  initial={{ opacity: 0, rotateX: -60, y: -10 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  exit={{ opacity: 0, rotateX: 60, y: 10 }}
                  transition={{ duration: 0.55, ease: EASE_LUX }}
                />
              </AnimatePresence>

              <p
                className={cn(
                  "text-eyebrow mt-3",
                  gold ? "text-gold-light" : "text-silver",
                )}
              >
                + {t.sub} +
              </p>
              <p
                className={cn(
                  "mt-1 font-display text-4xl font-bold",
                  gold ? "text-gold" : "bg-silver bg-clip-text text-transparent",
                )}
              >
                {guest}
              </p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.25em] text-cream/60">
                {t.badge}
              </p>

              <div
                className={cn(
                  "mx-auto mt-5 w-fit rounded-xl p-[2px] transition-[background] duration-700",
                  gold ? "bg-gold" : "bg-silver",
                )}
              >
                <div className="rounded-[0.65rem] bg-cream p-3">
                  <QRCodeSVG
                    value={qrValue}
                    size={148}
                    bgColor="transparent"
                    fgColor="#0F1E36"
                    level="M"
                    aria-label="QR Code tiket"
                  />
                </div>
              </div>

              {/* perforation */}
              <div aria-hidden className="relative my-5">
                <span className="absolute -left-8 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-navy-deep" />
                <span className="absolute -right-8 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-navy-deep" />
                <div className="border-t border-dashed border-gold/40" />
              </div>

              <p className="font-display text-lg tracking-[0.2em] text-cream">
                E-TICKET <span className={gold ? "text-gold" : "text-silver"}>#{ticket.code}</span>
              </p>
              <p className="mt-1 font-script text-2xl text-gold-light">{couple.short}</p>
              <p className="text-[0.7rem] text-cream/60">{events.resepsi.date}</p>
            </div>
          </motion.div>
        </div>
      </TiltCard>

      <div className="mx-auto mt-6 flex max-w-[340px] flex-col gap-3">
        <Button variant="goldOutline" size="pill" onClick={() => setDetail(true)}>
          <Info /> Tampilkan Detail
        </Button>
        <Button variant="gold" size="pill" onClick={download} disabled={busy}>
          <Download /> {busy ? "Menyiapkan…" : "DOWNLOAD TIKET"}
        </Button>
      </div>

      {/* Detail popup */}
      <AnimatePresence>
        {detail && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Detail tiket"
            className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-deep/80 p-4 backdrop-blur-md sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetail(false)}
          >
            <motion.div
              className="card-lux relative w-full max-w-[380px] p-6"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE_LUX }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setDetail(false)}
                aria-label="Tutup"
                className="bg-gold absolute -top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-primary-foreground shadow-[var(--shadow-gold)]"
              >
                <X className="h-5 w-5" />
              </button>
              <p className="text-eyebrow text-gold/80">Detail E-Ticket</p>
              <h3 className="mt-1 font-display text-3xl font-semibold text-gold-light">{guest}</h3>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Kode", `#${ticket.code}`],
                  ["Kategori", t.label],
                  ["Acara", `Resepsi ${couple.short}`],
                  ["Tanggal", events.resepsi.date],
                  ["Lokasi", events.resepsi.venue],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-gold/15 pb-2">
                    <dt className="text-cream/60">{k}</dt>
                    <dd className="text-right font-medium text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-cream/70">
                Tunjukkan QR Code ini kepada petugas penerima tamu saat tiba di lokasi resepsi.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

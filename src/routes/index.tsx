import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { scenery } from "@/components/invitation/assets";
import { Atmosphere } from "@/components/invitation/Atmosphere";
import { defaultGuest } from "@/components/invitation/data";
import { FloatingControls } from "@/components/invitation/FloatingControls";
import { GiftClosing } from "@/components/invitation/GiftClosing";
import { Guestbook } from "@/components/invitation/Guestbook";
import { Landing } from "@/components/invitation/Landing";
import { OpeningGallery } from "@/components/invitation/OpeningGallery";
import { Schedule } from "@/components/invitation/Schedule";
import { Ticket } from "@/components/invitation/Ticket";
import { useMusic } from "@/components/invitation/useMusic";

type InviteSearch = { to?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): InviteSearch => {
    const to = typeof search["to"] === "string" ? search["to"].trim().slice(0, 40) : "";
    return to ? { to } : {};
  },
  head: () => ({
    meta: [
      { title: "The Wedding of Shihab & Lia — 18 & 20 Desember 2026" },
      {
        name: "description",
        content:
          "Undangan pernikahan Shihab & Lia. Akad Nikah 18 Desember 2026 dan Resepsi 20 Desember 2026 di Singosari Ballroom Hotel Saptanawa, Gresik.",
      },
      { property: "og:title", content: "The Wedding of Shihab & Lia" },
      {
        property: "og:description",
        content:
          "Dengan penuh sukacita kami mengundang Anda di hari pernikahan Shihab & Lia, 18 & 20 Desember 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const { to } = Route.useSearch();
  const guest = to || defaultGuest;
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const music = useMusic();

  useEffect(() => {
    if (opened) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [opened]);

  return (
    <div className="relative min-h-screen">
      {/* Desktop backdrop around the phone-width invitation */}
      <div aria-hidden className="fixed inset-0 -z-10">
        <img
          src={scenery.gardenBg}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-50 blur-md"
        />
        <div className="absolute inset-0 bg-navy-deep/70" />
      </div>

      <motion.main
        className="relative mx-auto min-h-screen w-full max-w-[420px] overflow-x-clip bg-navy shadow-[0_0_80px_oklch(0_0_0/0.6)]"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-[420px] -translate-x-1/2">
          <Atmosphere petals={7} particles={8} />
        </div>
        <OpeningGallery ready={revealed} />
        <Schedule />
        <Ticket guest={guest} />
        <Guestbook />
        <GiftClosing />
      </motion.main>

      {!opened && (
        <Landing
          guest={guest}
          onOpenStart={() => void music.play()}
          onReveal={() => setRevealed(true)}
          onOpened={() => {
            setRevealed(true);
            setOpened(true);
          }}
        />
      )}
      {opened && <FloatingControls playing={music.playing} onToggleMusic={music.toggle} />}

      <Toaster
        position="top-center"
        toastOptions={{
          className: "!bg-navy-deep !text-cream !border !border-gold/40 !font-sans",
        }}
      />
    </div>
  );
}

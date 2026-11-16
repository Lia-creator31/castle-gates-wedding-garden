// Official Shihab & Lia visual assets, extracted from the official asset sheet.
// Keep every official graphic referenced from here so they stay in one place.
import monogram from "@/assets/official/monogram.png.asset.json";
import gateClosed from "@/assets/official/gate-closed.png.asset.json";
import gateLeft from "@/assets/official/gate-left.png.asset.json";
import gateRight from "@/assets/official/gate-right.png.asset.json";
import calendar from "@/assets/official/calendar.png.asset.json";
import akad from "@/assets/official/akad.png.asset.json";
import resepsi from "@/assets/official/resepsi.png.asset.json";
import mapPin from "@/assets/official/map-pin.png.asset.json";
import ticketVip from "@/assets/official/ticket-vip.png.asset.json";
import ticketReguler from "@/assets/official/ticket-reguler.png.asset.json";
import bukaUndangan from "@/assets/official/buka-undangan.png.asset.json";
import disc from "@/assets/official/disc.png.asset.json";
import arrowLeft from "@/assets/official/arrow-left.png.asset.json";
import arrowRight from "@/assets/official/arrow-right.png.asset.json";
import swipeHand from "@/assets/official/swipe-hand.png.asset.json";
import corner from "@/assets/official/corner.png.asset.json";
import divider from "@/assets/official/divider.png.asset.json";
import emblem from "@/assets/official/emblem.png.asset.json";

import gardenBg from "@/assets/garden-bg.jpg";
import butterfly from "@/assets/butterfly.png";

export const official = {
  monogram: monogram.url,
  gateClosed: gateClosed.url,
  gateLeft: gateLeft.url,
  gateRight: gateRight.url,
  calendar: calendar.url,
  akad: akad.url,
  resepsi: resepsi.url,
  mapPin: mapPin.url,
  ticketVip: ticketVip.url,
  ticketReguler: ticketReguler.url,
  bukaUndangan: bukaUndangan.url,
  disc: disc.url,
  arrowLeft: arrowLeft.url,
  arrowRight: arrowRight.url,
  swipeHand: swipeHand.url,
  corner: corner.url,
  divider: divider.url,
  emblem: emblem.url,
} as const;

export const scenery = {
  gardenBg,
  butterfly,
} as const;

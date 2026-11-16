// Guestbook logic kept free of React so it can later be swapped for a
// backend/database without changing the UI.

export const WISH_MAX_LENGTH = 280;
export const NAME_MAX_LENGTH = 40;

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: number;
};

export type WishInput = { name: string; message: string };

export type WishValidation = { ok: true; value: WishInput } | { ok: false; error: string };

export function validateWish(input: WishInput): WishValidation {
  const name = input.name.trim();
  const message = input.message.trim();
  if (!name) return { ok: false, error: "Mohon isi nama Anda." };
  if (name.length > NAME_MAX_LENGTH)
    return { ok: false, error: `Nama maksimal ${NAME_MAX_LENGTH} karakter.` };
  if (!message) return { ok: false, error: "Mohon tuliskan ucapan atau doa Anda." };
  if (message.length > WISH_MAX_LENGTH)
    return { ok: false, error: `Ucapan maksimal ${WISH_MAX_LENGTH} karakter.` };
  return { ok: true, value: { name, message } };
}

export function createWish(input: WishInput, now = Date.now()): Wish {
  return {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    message: input.message,
    createdAt: now,
  };
}

/** Newest first. */
export function addWish(list: Wish[], wish: Wish): Wish[] {
  return [wish, ...list];
}

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return "Baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

const HOUR = 3_600_000;
export function seedWishes(now = Date.now()): Wish[] {
  return [
    {
      id: "seed-1",
      name: "Keluarga Besar Hadi",
      message:
        "Selamat menempuh hidup baru, Shihab & Lia! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.",
      createdAt: now - 2 * HOUR,
    },
    {
      id: "seed-2",
      name: "Rina & Dimas",
      message:
        "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Bahagia selalu ya!",
      createdAt: now - 5 * HOUR,
    },
    {
      id: "seed-3",
      name: "Teman Kantor Lia",
      message: "Semoga cinta kalian tumbuh seindah taman bunga. Selamat berbahagia!",
      createdAt: now - 26 * HOUR,
    },
    {
      id: "seed-4",
      name: "Arif",
      message: "Selamat menempuh hidup baru, bro! Semoga langgeng sampai kakek nenek.",
      createdAt: now - 50 * HOUR,
    },
  ];
}

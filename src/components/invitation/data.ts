// All invitation content lives here so it can be edited (or loaded from a
// backend later) without touching the section components.

export const couple = {
  short: "Shihab & Lia",
  bride: "Lia",
  groom: "Shihab",
} as const;

export type CouplePerson = {
  role: "groom" | "bride";
  label: string;
  name: string;
  /** Replace `null` with the portrait URL once the photo is ready. */
  photo: string | null;
  /** "Putra dari" / "Putri dari". */
  childOf: string;
  /** Replace `null` with the real names; placeholders are shown until then. */
  father: string | null;
  mother: string | null;
};

export const couplePeople: { groom: CouplePerson; bride: CouplePerson } = {
  groom: { role: "groom", label: "The Groom", name: "Shihab", photo: null, childOf: "Putra dari", father: null, mother: null },
  bride: { role: "bride", label: "The Bride", name: "Lia", photo: null, childOf: "Putri dari", father: null, mother: null },
};

export const defaultGuest = "Pondra";

export const verse = {
  ref: "QS. Ar-Rum: 21",
  arabic:
    "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
  translation:
    "“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.”",
} as const;

export type GalleryPhoto = {
  id: number;
  /** Replace `null` with an image URL once the couple's photos are ready. */
  src: string | null;
  title: string;
  story: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 1,
    src: null,
    title: "Awal Cerita",
    story: "Sebuah pertemuan sederhana yang ternyata menjadi awal dari perjalanan panjang kami.",
  },
  {
    id: 2,
    src: null,
    title: "Senja Pertama",
    story: "Langit jingga, percakapan hangat, dan rasa yang perlahan tumbuh.",
  },
  {
    id: 3,
    src: null,
    title: "Saling Mengenal",
    story: "Mengenal satu sama lain, menerima setiap cerita dan setiap kekurangan.",
  },
  {
    id: 4,
    src: null,
    title: "Restu Keluarga",
    story: "Dua keluarga dipertemukan dalam doa dan restu yang tulus.",
  },
  {
    id: 5,
    src: null,
    title: "Lamaran",
    story: "Hari ketika sebuah janji diucapkan dengan sepenuh hati.",
  },
  {
    id: 6,
    src: null,
    title: "Taman Harapan",
    story: "Seperti taman yang dirawat, cinta kami tumbuh bersama kesabaran.",
  },
  {
    id: 7,
    src: null,
    title: "Menuju Halal",
    story: "Langkah demi langkah menuju ikatan suci yang kami nantikan.",
  },
  {
    id: 8,
    src: null,
    title: "Selamanya",
    story: "Kini kami siap menulis bab baru — bersama, dalam suka dan duka.",
  },
];

export const events = {
  akad: {
    title: "Akad Nikah",
    date: "Jumat, 18 Desember 2026",
    note: "Intimate Keluarga",
  },
  resepsi: {
    title: "Resepsi",
    date: "Minggu, 20 Desember 2026",
    venue: "Singosari Ballroom Hotel Saptanawa",
    address: "Jl. Arif Rahman Hakim No. 79, Sidomoro, Kecamatan Kebomas, Kabupaten Gresik",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Singosari+Ballroom+Hotel+Saptanawa+Jl.+Arif+Rahman+Hakim+No.+79+Gresik",
  },
} as const;

export const ticket = {
  code: "K2026",
} as const;

export const gifts = {
  accounts: [
    { bank: "BNI", holder: "Lia", number: "1234567890" },
    { bank: "Bank Mandiri", holder: "Shihab", number: "0987654321" },
  ],
  address:
    "Jl. Arif Rahman Hakim No. 79, Sidomoro, Kecamatan Kebomas, Kabupaten Gresik (u.p. Shihab/Lia)",
} as const;

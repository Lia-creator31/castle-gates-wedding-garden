import { Camera } from "lucide-react";

import { official } from "./assets";
import type { GalleryPhoto } from "./data";
import { cn } from "@/lib/utils";

/** Shows the photo, or an elegant replaceable placeholder while `src` is null. */
export function PhotoFace({ photo, large = false }: { photo: GalleryPhoto; large?: boolean }) {
  if (photo.src) {
    return (
      <img
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }
  const burgundy = photo.id % 2 === 1;
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-1 overflow-hidden",
        burgundy ? "bg-burgundy-gradient" : "bg-navy-gradient",
      )}
    >
      <img
        src={official.emblem}
        alt=""
        aria-hidden
        className={cn("h-auto opacity-25", large ? "w-32" : "w-10")}
      />
      <span className="flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.25em] text-gold-light/80">
        <Camera className="h-3 w-3" aria-hidden /> Foto {String(photo.id).padStart(2, "0")}
      </span>
    </div>
  );
}


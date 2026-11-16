import { describe, expect, it } from "vitest";

import { WISH_MAX_LENGTH, addWish, createWish, validateWish } from "./wishes";

describe("guestbook wishes", () => {
  it("requires a guest name", () => {
    expect(validateWish({ name: "  ", message: "Selamat!" }).ok).toBe(false);
  });

  it("requires a message", () => {
    expect(validateWish({ name: "Pondra", message: "   " }).ok).toBe(false);
  });

  it("rejects messages over the character limit", () => {
    const tooLong = "a".repeat(WISH_MAX_LENGTH + 1);
    expect(validateWish({ name: "Pondra", message: tooLong }).ok).toBe(false);
    expect(validateWish({ name: "Pondra", message: "a".repeat(WISH_MAX_LENGTH) }).ok).toBe(true);
  });

  it("shows a new wish first", () => {
    const old = createWish({ name: "A", message: "lama" }, 1);
    const fresh = createWish({ name: "Pondra", message: "baru" }, 2);
    expect(addWish([old], fresh)[0]?.name).toBe("Pondra");
  });
});

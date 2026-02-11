import { describe, expect, it } from "vitest";
import { calculateHash, getDifficultyPrefix, getHashPreview } from "@/lib/blockchain/hash-service";

describe("hash-service", () => {
  it("generates deterministic hash for same payload", () => {
    const input = {
      index: 1,
      timestamp: "2026-02-11T00:00:00.000Z",
      data: "Alice pays Bob 10",
      previousHash: "abc",
      nonce: 99,
    };
    const first = calculateHash(input);
    const second = calculateHash(input);
    expect(first).toEqual(second);
    expect(first.length).toBe(64);
  });

  it("returns shortened preview", () => {
    const preview = getHashPreview("1234567890abcdef");
    expect(preview).toBe("1234567890...");
  });

  it("returns difficulty prefix", () => {
    expect(getDifficultyPrefix(3)).toBe("000");
  });
});

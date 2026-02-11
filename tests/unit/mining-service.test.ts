import { describe, expect, it } from "vitest";
import { mineBlock } from "@/lib/blockchain/mining-service";

describe("mining-service", () => {
  it("mines block with required leading zeros", async () => {
    const result = await mineBlock({
      index: 1,
      data: "Alice pays Bob 10",
      previousHash: "a".repeat(64),
      difficulty: 2,
      timestamp: "2026-02-11T00:00:00.000Z",
    });
    expect(result.block.hash.startsWith("00")).toBe(true);
    expect(result.block.nonce).toBeGreaterThanOrEqual(0);
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
  });
});

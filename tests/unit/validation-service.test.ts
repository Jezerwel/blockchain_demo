import { describe, expect, it } from "vitest";
import { createBlock } from "@/lib/blockchain/block-factory";
import { validateBlockchain } from "@/lib/blockchain/validation-service";

describe("validation-service", () => {
  it("returns valid for a linked chain", async () => {
    const block0 = createBlock({
      index: 0,
      timestamp: "2026-02-11T00:00:00.000Z",
      data: "Genesis Block",
      previousHash: "0",
      nonce: 0,
    });
    const block1 = createBlock({
      index: 1,
      timestamp: "2026-02-11T00:00:01.000Z",
      data: "Alice pays Bob 10",
      previousHash: block0.hash,
      nonce: 0,
    });
    const result = await validateBlockchain({
      blocks: [block0, block1],
    });
    expect(result.isValid).toBe(true);
    expect(result.invalidAtIndex).toBeNull();
  });

  it("returns invalid index for tampered block", async () => {
    const block0 = createBlock({
      index: 0,
      timestamp: "2026-02-11T00:00:00.000Z",
      data: "Genesis Block",
      previousHash: "0",
      nonce: 0,
    });
    const block1 = {
      ...createBlock({
        index: 1,
        timestamp: "2026-02-11T00:00:01.000Z",
        data: "Alice pays Bob 10",
        previousHash: block0.hash,
        nonce: 0,
      }),
      data: "Tampered Data",
      isTampered: true,
    };
    const result = await validateBlockchain({
      blocks: [block0, block1],
    });
    expect(result.isValid).toBe(false);
    expect(result.invalidAtIndex).toBe(1);
  });
});

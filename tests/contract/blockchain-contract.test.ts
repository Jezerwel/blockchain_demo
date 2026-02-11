import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { autoMineRequestSchema, difficultySchema } from "@/lib/schemas/blockchain-schema";

describe("blockchain contract alignment", () => {
  it("matches documented difficulty bounds", () => {
    expect(difficultySchema.safeParse(1).success).toBe(true);
    expect(difficultySchema.safeParse(4).success).toBe(true);
    expect(difficultySchema.safeParse(0).success).toBe(false);
    expect(difficultySchema.safeParse(5).success).toBe(false);
  });

  it("matches documented auto-mine bounds", () => {
    expect(autoMineRequestSchema.safeParse({ count: 1, dataPrefix: "seed" }).success).toBe(true);
    expect(autoMineRequestSchema.safeParse({ count: 20, dataPrefix: "seed" }).success).toBe(true);
    expect(autoMineRequestSchema.safeParse({ count: 21, dataPrefix: "seed" }).success).toBe(false);
  });

  it("contains required endpoints in openapi file", () => {
    const contractPath = path.resolve(
      process.cwd(),
      "specs/001-blockchain-visualizer/contracts/blockchain-api.openapi.yaml",
    );
    const contract = readFileSync(contractPath, "utf8");
    expect(contract.includes("/chain/validate")).toBe(true);
    expect(contract.includes("/blocks/{index}")).toBe(true);
    expect(contract.includes("/blocks/mine")).toBe(true);
  });
});

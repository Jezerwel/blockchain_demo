import { calculateHash, getDifficultyPrefix } from "@/lib/blockchain/hash-service";
import { MINING_PROGRESS_INTERVAL } from "@/lib/constants/blockchain-config";
import type { MineBlockParams, MinedBlockResult } from "@/types/blockchain-types";

async function yieldToUi(): Promise<void> {
  await new Promise<void>((resolve: () => void) => {
    setTimeout(resolve, 0);
  });
}

export async function mineBlock(params: MineBlockParams): Promise<MinedBlockResult> {
  const timestamp: string = params.timestamp ?? new Date().toISOString();
  const difficultyPrefix: string = getDifficultyPrefix(params.difficulty);
  const startedAt: number = performance.now();
  let nonce: number = 0;
  let attempts: number = 0;
  while (true) {
    const hash: string = calculateHash({
      index: params.index,
      timestamp,
      data: params.data,
      previousHash: params.previousHash,
      nonce,
    });
    attempts += 1;
    if (hash.startsWith(difficultyPrefix)) {
      const elapsedMs: number = Math.round(performance.now() - startedAt);
      return {
        attempts,
        elapsedMs,
        block: {
          index: params.index,
          timestamp,
          data: params.data,
          previousHash: params.previousHash,
          nonce,
          hash,
          isTampered: false,
          miningDurationMs: elapsedMs,
        },
      };
    }
    if (params.onProgress && attempts % MINING_PROGRESS_INTERVAL === 0) {
      params.onProgress({
        attempts,
        elapsedMs: Math.round(performance.now() - startedAt),
      });
      await yieldToUi();
    }
    nonce += 1;
  }
}

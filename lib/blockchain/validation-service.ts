import { calculateHash } from "@/lib/blockchain/hash-service";
import { VALIDATION_PROGRESS_DELAY_MS } from "@/lib/constants/blockchain-config";
import type {
  Block,
  ValidationProgress,
  ValidationResult,
} from "@/types/blockchain-types";

async function waitValidationFrame(): Promise<void> {
  await new Promise<void>((resolve: () => void) => {
    setTimeout(resolve, VALIDATION_PROGRESS_DELAY_MS);
  });
}

export async function validateBlockchain(params: {
  blocks: ReadonlyArray<Block>;
  onProgress?: (progress: ValidationProgress) => void;
}): Promise<ValidationResult> {
  const blocks: ReadonlyArray<Block> = params.blocks;
  if (blocks.length === 0) {
    return {
      isValid: false,
      invalidAtIndex: 0,
      checkedCount: 0,
    };
  }
  for (let index: number = 0; index < blocks.length; index += 1) {
    const block: Block = blocks[index];
    const recalculatedHash: string = calculateHash({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce,
    });
    if (recalculatedHash !== block.hash) {
      return {
        isValid: false,
        invalidAtIndex: index,
        checkedCount: index + 1,
      };
    }
    if (index > 0) {
      const previousBlock: Block = blocks[index - 1];
      if (block.previousHash !== previousBlock.hash) {
        return {
          isValid: false,
          invalidAtIndex: index,
          checkedCount: index + 1,
        };
      }
    }
    if (params.onProgress) {
      params.onProgress({
        currentIndex: index,
        checkedCount: index + 1,
      });
      await waitValidationFrame();
    }
  }
  return {
    isValid: true,
    invalidAtIndex: null,
    checkedCount: blocks.length,
  };
}

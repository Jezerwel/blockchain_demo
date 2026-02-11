import {
  GENESIS_PREVIOUS_HASH,
  MIN_DIFFICULTY,
} from "@/lib/constants/blockchain-config";
import { calculateHash } from "@/lib/blockchain/hash-service";
import { mineBlock } from "@/lib/blockchain/mining-service";
import type { Block } from "@/types/blockchain-types";

export function createBlock(params: {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
  miningDurationMs?: number | null;
  isTampered?: boolean;
}): Block {
  const hash: string = calculateHash({
    index: params.index,
    timestamp: params.timestamp,
    data: params.data,
    previousHash: params.previousHash,
    nonce: params.nonce,
  });
  return {
    index: params.index,
    timestamp: params.timestamp,
    data: params.data,
    previousHash: params.previousHash,
    nonce: params.nonce,
    hash,
    isTampered: params.isTampered ?? false,
    miningDurationMs: params.miningDurationMs ?? null,
  };
}

export async function createGenesisBlock(): Promise<Block> {
  const result = await mineBlock({
    index: 0,
    timestamp: new Date(0).toISOString(),
    data: "Genesis Block",
    previousHash: GENESIS_PREVIOUS_HASH,
    difficulty: MIN_DIFFICULTY,
  });
  return result.block;
}

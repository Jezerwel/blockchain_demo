import SHA256 from "crypto-js/sha256";
import { HASH_PREVIEW_LENGTH } from "@/lib/constants/blockchain-config";

export function calculateHash(params: {
  index: number;
  timestamp: string;
  data: string;
  previousHash: string;
  nonce: number;
}): string {
  const payload: string = `${params.index}|${params.timestamp}|${params.data}|${params.previousHash}|${params.nonce}`;
  return SHA256(payload).toString();
}

export function getHashPreview(hash: string): string {
  if (hash.length <= HASH_PREVIEW_LENGTH) return hash;
  return `${hash.slice(0, HASH_PREVIEW_LENGTH)}...`;
}

export function getDifficultyPrefix(difficulty: number): string {
  return "0".repeat(Math.max(0, difficulty));
}

import { z } from "zod";
import {
  AUTO_MINE_MAX_COUNT,
  MAX_DATA_LENGTH,
  MAX_DIFFICULTY,
  MIN_DIFFICULTY,
} from "@/lib/constants/blockchain-config";

export const dataSchema = z
  .string()
  .trim()
  .min(1)
  .max(MAX_DATA_LENGTH);

export const difficultySchema = z
  .number()
  .int()
  .min(MIN_DIFFICULTY)
  .max(MAX_DIFFICULTY);

export const blockSchema = z.object({
  index: z.number().int().nonnegative(),
  timestamp: z.string().datetime({ offset: true }),
  data: dataSchema,
  previousHash: z.string().min(1),
  nonce: z.number().int().nonnegative(),
  hash: z.string().length(64),
  isTampered: z.boolean(),
  miningDurationMs: z.number().nonnegative().nullable(),
});

export const blockchainStateSchema = z.object({
  blocks: z.array(blockSchema).min(1),
  difficulty: difficultySchema,
  isValid: z.boolean(),
  invalidAtIndex: z.number().int().nonnegative().nullable(),
  lastValidatedAt: z.string().datetime({ offset: true }).nullable(),
});

export const autoMineRequestSchema = z.object({
  count: z.number().int().min(1).max(AUTO_MINE_MAX_COUNT),
  dataPrefix: z.string().trim().min(1).max(100),
});

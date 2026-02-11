import {
  AUTO_MINE_MAX_COUNT,
  DEFAULT_DIFFICULTY,
  MAX_DIFFICULTY,
  MIN_DIFFICULTY,
} from "@/lib/constants/blockchain-config";
import {
  autoMineRequestSchema,
  blockchainStateSchema,
  dataSchema,
  difficultySchema,
} from "@/lib/schemas/blockchain-schema";
import { createGenesisBlock } from "@/lib/blockchain/block-factory";
import { mineBlock } from "@/lib/blockchain/mining-service";
import { validateBlockchain } from "@/lib/blockchain/validation-service";
import type {
  Block,
  BlockchainState,
  MinedBlockResult,
  ValidationProgress,
  ValidationResult,
} from "@/types/blockchain-types";

function getNowIso(): string {
  return new Date().toISOString();
}

async function buildValidatedState(params: {
  blocks: ReadonlyArray<Block>;
  difficulty: number;
  onProgress?: (progress: ValidationProgress) => void;
}): Promise<BlockchainState> {
  const result: ValidationResult = await validateBlockchain({
    blocks: params.blocks,
    onProgress: params.onProgress,
  });
  const state: BlockchainState = {
    blocks: params.blocks,
    difficulty: params.difficulty,
    isValid: result.isValid,
    invalidAtIndex: result.invalidAtIndex,
    lastValidatedAt: getNowIso(),
  };
  return blockchainStateSchema.parse(state);
}

export async function createInitialBlockchainState(): Promise<BlockchainState> {
  const genesisBlock: Block = await createGenesisBlock();
  return buildValidatedState({
    blocks: [genesisBlock],
    difficulty: DEFAULT_DIFFICULTY,
  });
}

export function normalizeDifficulty(difficulty: number): number {
  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
}

export async function mineAndAppendBlock(params: {
  state: BlockchainState;
  data: string;
  onProgress?: (attempts: number, elapsedMs: number) => void;
}): Promise<{ state: BlockchainState; mined: MinedBlockResult }> {
  const inputData: string = dataSchema.parse(params.data);
  const lastBlock: Block = params.state.blocks[params.state.blocks.length - 1];
  const miningResult: MinedBlockResult = await mineBlock({
    index: lastBlock.index + 1,
    data: inputData,
    previousHash: lastBlock.hash,
    difficulty: params.state.difficulty,
    onProgress: params.onProgress
      ? (progress) => params.onProgress?.(progress.attempts, progress.elapsedMs)
      : undefined,
  });
  const nextBlocks: ReadonlyArray<Block> = [...params.state.blocks, miningResult.block];
  const nextState: BlockchainState = await buildValidatedState({
    blocks: nextBlocks,
    difficulty: params.state.difficulty,
  });
  return {
    state: nextState,
    mined: miningResult,
  };
}

export async function updateDifficulty(params: {
  state: BlockchainState;
  difficulty: number;
}): Promise<BlockchainState> {
  const difficulty: number = difficultySchema.parse(params.difficulty);
  return buildValidatedState({
    blocks: params.state.blocks,
    difficulty,
  });
}

export async function editBlockData(params: {
  state: BlockchainState;
  index: number;
  data: string;
}): Promise<BlockchainState> {
  const inputData: string = dataSchema.parse(params.data);
  const nextBlocks: ReadonlyArray<Block> = params.state.blocks.map((block: Block) => {
    if (block.index !== params.index) return block;
    return {
      ...block,
      data: inputData,
      isTampered: true,
    };
  });
  return buildValidatedState({
    blocks: nextBlocks,
    difficulty: params.state.difficulty,
  });
}

export async function validateCurrentState(params: {
  state: BlockchainState;
  onProgress?: (progress: ValidationProgress) => void;
}): Promise<BlockchainState> {
  return buildValidatedState({
    blocks: params.state.blocks,
    difficulty: params.state.difficulty,
    onProgress: params.onProgress,
  });
}

export async function autoMineBlocks(params: {
  state: BlockchainState;
  count: number;
  dataPrefix: string;
  onBlockMined?: (result: MinedBlockResult) => void;
}): Promise<BlockchainState> {
  const parsed = autoMineRequestSchema.parse({
    count: Math.min(params.count, AUTO_MINE_MAX_COUNT),
    dataPrefix: params.dataPrefix,
  });
  let nextState: BlockchainState = params.state;
  for (let index: number = 0; index < parsed.count; index += 1) {
    const result = await mineAndAppendBlock({
      state: nextState,
      data: `${parsed.dataPrefix} ${index + 1}`,
    });
    nextState = result.state;
    params.onBlockMined?.(result.mined);
  }
  return nextState;
}

export interface Block {
  readonly index: number;
  readonly timestamp: string;
  readonly data: string;
  readonly previousHash: string;
  readonly nonce: number;
  readonly hash: string;
  readonly isTampered: boolean;
  readonly miningDurationMs: number | null;
}

export interface BlockchainState {
  readonly blocks: ReadonlyArray<Block>;
  readonly difficulty: number;
  readonly isValid: boolean;
  readonly invalidAtIndex: number | null;
  readonly lastValidatedAt: string | null;
}

export interface ValidationProgress {
  readonly currentIndex: number;
  readonly checkedCount: number;
}

export interface ValidationResult {
  readonly isValid: boolean;
  readonly invalidAtIndex: number | null;
  readonly checkedCount: number;
}

export interface MiningProgress {
  readonly attempts: number;
  readonly elapsedMs: number;
}

export interface MineBlockParams {
  readonly index: number;
  readonly data: string;
  readonly previousHash: string;
  readonly difficulty: number;
  readonly timestamp?: string;
  readonly onProgress?: (progress: MiningProgress) => void;
}

export interface MinedBlockResult {
  readonly block: Block;
  readonly attempts: number;
  readonly elapsedMs: number;
}

export interface AutoMineParams {
  readonly count: number;
  readonly dataPrefix: string;
  readonly difficulty: number;
  readonly startIndex: number;
  readonly previousHash: string;
  readonly onBlockMined?: (result: MinedBlockResult) => void;
}

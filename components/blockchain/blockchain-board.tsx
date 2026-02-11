"use client";

import { useEffect, useMemo, useState } from "react";
import { BlockCard } from "@/components/blockchain/block-card";
import { DifficultySelector } from "@/components/blockchain/difficulty-selector";
import { LedgerView } from "@/components/blockchain/ledger-view";
import { MiningControls } from "@/components/blockchain/mining-controls";
import { ValidationIndicator } from "@/components/blockchain/validation-indicator";
import { AUTO_MINE_MAX_COUNT } from "@/lib/constants/blockchain-config";
import {
  autoMineBlocks,
  createInitialBlockchainState,
  editBlockData,
  mineAndAppendBlock,
  updateDifficulty,
  validateCurrentState,
} from "@/lib/blockchain/chain-service";
import type { Block, BlockchainState, ValidationProgress } from "@/types/blockchain-types";

export function BlockchainBoard() {
  const [state, setState] = useState<BlockchainState | null>(null);
  const [inputData, setInputData] = useState<string>("Alice pays Bob 10");
  const [autoMineCount, setAutoMineCount] = useState<number>(3);
  const [isMining, setIsMining] = useState<boolean>(false);
  const [isAutoMining, setIsAutoMining] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [checkedCount, setCheckedCount] = useState<number>(0);
  const [miningElapsedMs, setMiningElapsedMs] = useState<number>(0);
  const isBusy: boolean = isMining || isAutoMining || isValidating;
  useEffect(() => {
    void (async () => {
      const initialState: BlockchainState = await createInitialBlockchainState();
      setState(initialState);
    })();
  }, []);
  const blocks: ReadonlyArray<Block> = useMemo(() => state?.blocks ?? [], [state]);
  async function runValidationWithProgress(nextState: BlockchainState): Promise<void> {
    setIsValidating(true);
    setCheckedCount(0);
    const validatedState: BlockchainState = await validateCurrentState({
      state: nextState,
      onProgress: (progress: ValidationProgress) => {
        setCheckedCount(progress.checkedCount);
      },
    });
    setState(validatedState);
    setIsValidating(false);
  }
  async function handleMineBlock(): Promise<void> {
    if (!state || isBusy) return;
    setIsMining(true);
    const mined = await mineAndAppendBlock({
      state,
      data: inputData,
      onProgress: (_attempts: number, elapsedMs: number) => {
        setMiningElapsedMs(elapsedMs);
      },
    });
    setMiningElapsedMs(mined.mined.elapsedMs);
    setIsMining(false);
    await runValidationWithProgress(mined.state);
  }
  async function handleAutoMine(): Promise<void> {
    if (!state || isBusy) return;
    setIsAutoMining(true);
    const nextState: BlockchainState = await autoMineBlocks({
      state,
      count: autoMineCount,
      dataPrefix: inputData || "Auto transaction",
      onBlockMined: (result) => {
        setMiningElapsedMs(result.elapsedMs);
      },
    });
    setIsAutoMining(false);
    await runValidationWithProgress(nextState);
  }
  async function handleDifficultyChange(value: number): Promise<void> {
    if (!state || isBusy) return;
    const nextState: BlockchainState = await updateDifficulty({
      state,
      difficulty: value,
    });
    await runValidationWithProgress(nextState);
  }
  async function handleSaveEdit(index: number, data: string): Promise<void> {
    if (!state || isBusy) return;
    const nextState: BlockchainState = await editBlockData({
      state,
      index,
      data,
    });
    await runValidationWithProgress(nextState);
  }
  async function handleValidateNow(): Promise<void> {
    if (!state || isBusy) return;
    await runValidationWithProgress(state);
  }
  function handleAutoMineCountChange(value: number): void {
    if (!Number.isFinite(value)) return;
    const sanitizedValue: number = Math.max(1, Math.min(AUTO_MINE_MAX_COUNT, Math.trunc(value)));
    setAutoMineCount(sanitizedValue);
  }
  if (!state) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center p-6">
        <p className="font-pixel text-xs tracking-[0.2em] text-cyan-300">Booting chain...</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-6">
      <header className="rounded-xl border border-cyan-500/50 bg-zinc-950/70 p-6 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
        <h1 className="font-pixel text-xl uppercase tracking-[0.25em] text-cyan-200">
          Blockchain Visualizer
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Explore hashes, proof-of-work mining, tampering, and real-time validation.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <MiningControls
          value={inputData}
          autoMineCount={autoMineCount}
          isMining={isMining}
          isAutoMining={isAutoMining}
          miningElapsedMs={miningElapsedMs}
          onChangeValue={setInputData}
          onChangeAutoMineCount={handleAutoMineCountChange}
          onMine={() => {
            void handleMineBlock();
          }}
          onAutoMine={() => {
            void handleAutoMine();
          }}
        />
        <div className="flex flex-col gap-3">
          <DifficultySelector
            difficulty={state.difficulty}
            isDisabled={isBusy}
            onChange={(value: number) => {
              void handleDifficultyChange(value);
            }}
          />
          <ValidationIndicator
            isValid={state.isValid}
            invalidAtIndex={state.invalidAtIndex}
            isValidating={isValidating}
            checkedCount={checkedCount}
          />
          <button
            type="button"
            aria-label="Run validation"
            className="rounded-md border border-emerald-400/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
            disabled={isBusy}
            onClick={() => {
              void handleValidateNow();
            }}
          >
            Validate Now
          </button>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block: Block, index: number) => {
          const previousHash: string | null = index === 0 ? null : blocks[index - 1].hash;
          const isInvalid: boolean = state.invalidAtIndex !== null && index >= state.invalidAtIndex;
          return (
            <BlockCard
              key={block.hash}
              block={block}
              previousBlockHash={previousHash}
              isInvalid={isInvalid}
              isBusy={isBusy}
              onSaveEdit={(targetIndex: number, value: string) => {
                void handleSaveEdit(targetIndex, value);
              }}
            />
          );
        })}
      </section>
      <LedgerView blocks={blocks} />
    </div>
  );
}

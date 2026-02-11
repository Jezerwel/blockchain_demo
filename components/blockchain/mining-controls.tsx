"use client";

import type { ChangeEvent } from "react";

interface MiningControlsProps {
  readonly value: string;
  readonly autoMineCount: number;
  readonly isMining: boolean;
  readonly isAutoMining: boolean;
  readonly miningElapsedMs: number;
  readonly onChangeValue: (value: string) => void;
  readonly onChangeAutoMineCount: (value: number) => void;
  readonly onMine: () => void;
  readonly onAutoMine: () => void;
}

export function MiningControls(props: MiningControlsProps) {
  return (
    <section className="flex w-full flex-col gap-3 rounded-xl border border-fuchsia-400/40 bg-zinc-950/60 p-4">
      <label htmlFor="block-data" className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">
        Block Data
      </label>
      <input
        id="block-data"
        aria-label="Block data input"
        className="rounded-md border border-cyan-400/60 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-fuchsia-400 focus:ring-2"
        placeholder="Alice pays Bob 10"
        value={props.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          props.onChangeValue(event.target.value)
        }
      />
      <div className="flex items-center gap-3">
        <label htmlFor="auto-mine-count" className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Auto Mine Count
        </label>
        <input
          id="auto-mine-count"
          aria-label="Auto mine count input"
          type="number"
          min={1}
          max={20}
          className="w-24 rounded-md border border-cyan-400/60 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none ring-fuchsia-400 focus:ring-2"
          value={props.autoMineCount}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            props.onChangeAutoMineCount(Number(event.target.value))
          }
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label="Mine block button"
          disabled={props.isMining || props.isAutoMining}
          className={`cursor-pointer rounded-md bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50 ${props.isMining ? "mining-pulse" : ""}`}
          onClick={props.onMine}
        >
          {props.isMining ? "Mining..." : "Mine Block"}
        </button>
        <button
          type="button"
          aria-label="Auto mine blocks button"
          disabled={props.isMining || props.isAutoMining}
          className="cursor-pointer rounded-md border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={props.onAutoMine}
        >
          {props.isAutoMining ? "Auto Mining..." : `Auto Mine x${props.autoMineCount}`}
        </button>
        <span className="text-xs text-cyan-200">
          Last mining time: <strong>{props.miningElapsedMs}ms</strong>
        </span>
      </div>
    </section>
  );
}

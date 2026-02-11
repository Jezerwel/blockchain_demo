"use client";

import type { ChangeEvent } from "react";
import { MAX_DIFFICULTY, MIN_DIFFICULTY } from "@/lib/constants/blockchain-config";

interface DifficultySelectorProps {
  readonly difficulty: number;
  readonly isDisabled: boolean;
  readonly onChange: (value: number) => void;
}

export function DifficultySelector(props: DifficultySelectorProps) {
  const options: number[] = [];
  for (let value: number = MIN_DIFFICULTY; value <= MAX_DIFFICULTY; value += 1) {
    options.push(value);
  }
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="difficulty" className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        Difficulty
      </label>
      <select
        id="difficulty"
        aria-label="Select mining difficulty"
        className="rounded-md border border-cyan-400/60 bg-zinc-900 px-3 py-2 text-sm text-cyan-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 disabled:opacity-50"
        disabled={props.isDisabled}
        value={props.difficulty}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          props.onChange(Number(event.target.value))
        }
      >
        {options.map((value: number) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}

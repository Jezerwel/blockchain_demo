"use client";

import type { Block } from "@/types/blockchain-types";

interface LedgerViewProps {
  readonly blocks: ReadonlyArray<Block>;
}

export function LedgerView(props: LedgerViewProps) {
  return (
    <section className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
      <h2 className="font-pixel text-xs uppercase tracking-[0.2em] text-cyan-300">Ledger</h2>
      <ul className="mt-3 space-y-1 text-xs text-zinc-200">
        {props.blocks.map((block: Block) => (
          <li key={block.hash}>
            Block {block.index}: {block.data}
          </li>
        ))}
      </ul>
    </section>
  );
}

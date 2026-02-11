"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { getHashPreview } from "@/lib/blockchain/hash-service";
import { ChainLinkOverlay } from "@/components/blockchain/chain-link-overlay";
import type { Block } from "@/types/blockchain-types";

interface BlockCardProps {
  readonly block: Block;
  readonly previousBlockHash: string | null;
  readonly isInvalid: boolean;
  readonly isBusy: boolean;
  readonly onSaveEdit: (index: number, data: string) => void;
}

export function BlockCard(props: BlockCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftData, setDraftData] = useState<string>(props.block.data);
  function handleStartEdit(): void {
    setDraftData(props.block.data);
    setIsEditing(true);
  }
  function handleCancelEdit(): void {
    setDraftData(props.block.data);
    setIsEditing(false);
  }
  function handleSaveEdit(): void {
    props.onSaveEdit(props.block.index, draftData);
    setIsEditing(false);
  }
  const borderClassName: string = props.isInvalid
    ? "border-red-500 shadow-red-500/30"
    : "border-cyan-500/60 shadow-cyan-500/20";
  return (
    <article className={`rounded-xl border bg-zinc-950/70 p-4 shadow-lg ${borderClassName}`}>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-pixel text-xs uppercase tracking-[0.2em] text-cyan-200">
          Block #{props.block.index}
        </h3>
        <span className="text-[10px] text-zinc-300">{new Date(props.block.timestamp).toLocaleString()}</span>
      </header>
      <dl className="grid gap-2 text-xs">
        <div>
          <dt className="text-zinc-400">Data</dt>
          <dd className="text-zinc-100">
            {isEditing ? (
              <input
                aria-label={`Edit block ${props.block.index} data`}
                className="mt-1 w-full rounded border border-cyan-500/70 bg-zinc-900 px-2 py-1 text-xs outline-none ring-fuchsia-400 focus:ring-1"
                value={draftData}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setDraftData(event.target.value)
                }
              />
            ) : (
              props.block.data
            )}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-400">Nonce</dt>
          <dd className="font-mono text-cyan-200">{props.block.nonce}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Hash</dt>
          <dd className="font-mono text-fuchsia-200">{getHashPreview(props.block.hash)}</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Previous Hash</dt>
          <dd className="font-mono text-emerald-200">{getHashPreview(props.block.previousHash)}</dd>
        </div>
      </dl>
      {props.previousBlockHash ? (
        <div className="mt-3">
          <ChainLinkOverlay previousHash={props.block.previousHash} expectedHash={props.previousBlockHash} />
        </div>
      ) : null}
      <div className="mt-3 flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              aria-label={`Save block ${props.block.index} edit`}
              className="rounded bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-zinc-950 hover:bg-fuchsia-400 disabled:opacity-50"
              disabled={props.isBusy}
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              type="button"
              aria-label={`Cancel block ${props.block.index} edit`}
              className="rounded border border-zinc-500 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-800"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-label={`Edit block ${props.block.index}`}
            className="rounded border border-cyan-500/60 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-500/10 disabled:opacity-50"
            disabled={props.isBusy}
            onClick={handleStartEdit}
          >
            Edit
          </button>
        )}
        {props.block.isTampered ? (
          <span className="rounded bg-red-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-300">
            Tampered
          </span>
        ) : null}
      </div>
    </article>
  );
}

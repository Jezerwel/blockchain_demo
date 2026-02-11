"use client";

import { getHashPreview } from "@/lib/blockchain/hash-service";

interface ChainLinkOverlayProps {
  readonly previousHash: string;
  readonly expectedHash: string;
}

export function ChainLinkOverlay(props: ChainLinkOverlayProps) {
  const isMatching: boolean = props.previousHash === props.expectedHash;
  const colorClassName: string = isMatching
    ? "border-emerald-400/70 text-emerald-300"
    : "border-red-400/70 text-red-300";
  return (
    <div className={`rounded-md border px-2 py-1 text-[10px] ${colorClassName}`}>
      <div className="flex items-center gap-1">
        <span>prev</span>
        <span>→</span>
        <span>hash</span>
      </div>
      <div className="mt-1 font-mono">
        {getHashPreview(props.previousHash)} / {getHashPreview(props.expectedHash)}
      </div>
    </div>
  );
}

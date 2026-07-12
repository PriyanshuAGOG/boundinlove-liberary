import type { CSSProperties } from "react";

type FloatingMotifsProps = { symbol?: string; count?: number };

export function FloatingMotifs({ symbol = "✦", count = 10 }: FloatingMotifsProps) {
  return (
    <div className="invite-motifs" aria-hidden="true">
      {Array.from({ length: Math.min(count, 18) }).map((_, index) => (
        <span key={index} style={{ "--motif-index": index } as CSSProperties}>{symbol}</span>
      ))}
    </div>
  );
}

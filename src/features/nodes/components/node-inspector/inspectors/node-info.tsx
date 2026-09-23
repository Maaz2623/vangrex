"use client";

import type { VangrexNode } from "@/features/nodes/types/node-data";

interface Props {
  node: VangrexNode;
}

export function NodeInfo({ node }: Props) {
  const type = typeof node.data.type === "string" ? node.data.type : "unknown";

  return (
    <div className="rounded-lg border bg-muted/20 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Type</span>

        <span className="font-mono text-[11px]">{type}</span>
      </div>
    </div>
  );
}

"use client";

import { ArrowDownToLine } from "lucide-react";

import type { NodeInspectorContentProps } from "../types";

export function OutputInspector({ node }: NodeInspectorContentProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
            <ArrowDownToLine className="size-4 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Workflow output</h3>

            <p className="text-xs leading-relaxed text-muted-foreground">
              The value connected to this node becomes the final output returned
              by the workflow.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Input</h3>

          <p className="text-xs text-muted-foreground">
            Connect a value to the input below.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Value</p>

            <p className="text-xs text-muted-foreground">value</p>
          </div>

          <span className="rounded-md border bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground">
            input
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-dashed p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          The Output node does not have any configuration. Its result is
          determined entirely by the value connected to its input.
        </p>
      </div>
    </div>
  );
}

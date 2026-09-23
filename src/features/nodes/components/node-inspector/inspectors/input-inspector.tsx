"use client";

import { Textarea } from "@/components/ui/textarea";

import type { VangrexNode } from "@/features/nodes/types/node-data";
import type { NodeInspectorContentProps } from "../types";

export function InputInspector({ node, onUpdate }: NodeInspectorContentProps) {
  const config =
    node.data.config &&
    typeof node.data.config === "object" &&
    !Array.isArray(node.data.config)
      ? (node.data.config as Record<string, unknown>)
      : {};

  const value = typeof config.value === "string" ? config.value : "";

  const updateValue = (value: string) => {
    onUpdate(node.id, {
      ...node.data,
      config: {
        ...config,
        value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-medium">Input value</h3>

          <p className="text-xs text-muted-foreground">
            The value provided to the workflow.
          </p>
        </div>

        <Textarea
          value={value}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="Enter a value..."
          className="min-h-32 resize-y font-mono text-sm"
        />
      </div>

      <div className="rounded-lg border bg-muted/30 p-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This value is exposed through the{" "}
          <span className="font-medium text-foreground">Value</span> output of
          the Input node.
        </p>
      </div>
    </div>
  );
}

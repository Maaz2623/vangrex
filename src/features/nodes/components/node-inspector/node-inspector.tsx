"use client";

import { GenerateInspector } from "./inspectors/ai-generate-inspector";
import { InputInspector } from "./inspectors/input-inspector";
import { OutputInspector } from "./inspectors/output-inspector";
import { NodeInspectorShell } from "./node-inspector-shell";

import type { NodeInspectorProps } from "./types";

export function NodeInspector({
  node,
  onUpdate,
  onDelete,
  onClose,
}: NodeInspectorProps) {
  const type = typeof node.data.type === "string" ? node.data.type : "";

  let content: React.ReactNode;

  switch (type) {
    case "core.input":
      content = <InputInspector node={node} onUpdate={onUpdate} />;
      break;

    case "core.output":
      content = <OutputInspector node={node} onUpdate={onUpdate} />;
      break;

    case "ai.generate":
      content = <GenerateInspector node={node} onUpdate={onUpdate} />;
      break;

    default:
      content = (
        <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-4 text-center">
          <p className="text-xs text-muted-foreground">Unknown node type.</p>
        </div>
      );
  }

  return (
    <NodeInspectorShell
      node={node}
      onClose={onClose}
      onDelete={() => onDelete(node.id)}
    >
      {content}
    </NodeInspectorShell>
  );
}

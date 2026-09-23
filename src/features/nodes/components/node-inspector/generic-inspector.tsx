"use client";

import { nodeRegistry } from "@/features/nodes";
import { NodeInspectorContentProps } from "./types";
import { InspectorFields } from "./inspector-fields";


export function GenericInspector({
  node,
  onUpdate,
}: NodeInspectorContentProps) {
  const type = typeof node.data.type === "string" ? node.data.type : null;

  const definition =
    type && nodeRegistry.has(type) ? nodeRegistry.get(type) : null;

  if (
    !definition ||
    !definition.configFields ||
    definition.configFields.length === 0
  ) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          This node has no configuration options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">Configuration</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Configure this node&apos;s behavior.
        </p>
      </div>

      <InspectorFields
        node={node}
        fields={definition.configFields}
        onUpdate={onUpdate}
      />
    </div>
  );
}

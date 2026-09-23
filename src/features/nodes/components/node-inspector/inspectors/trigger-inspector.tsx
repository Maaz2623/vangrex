"use client";

import { nodeRegistry } from "@/features/nodes";

import { InspectorFields } from "../inspector-fields";
import { NodeInfo } from "./node-info";

import type { NodeInspectorContentProps } from "../types";

export function TriggerInspector({
  node,
  onUpdate,
}: NodeInspectorContentProps) {
  const definition = nodeRegistry.get(node.data.type);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium">Trigger</p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Configure how this workflow starts.
        </p>
      </div>

      <NodeInfo node={node} />

      {definition?.configFields && definition.configFields.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <InspectorFields
            node={node}
            fields={definition.configFields}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}

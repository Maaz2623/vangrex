import type { Node } from "@xyflow/react";
import type { NodeDefinition } from "@vangrex/node-sdk";

export function toCanvasNode(
  definition: NodeDefinition<any, any>,
  id: string,
  position: { x: number; y: number },
): Node {
  return {
    id,
    type: "default",
    position,
    data: {
      label: definition.name,
      type: definition.type,
    },
  };
}

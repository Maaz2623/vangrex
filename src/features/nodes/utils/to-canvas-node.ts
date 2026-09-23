import type { NodeType } from "../registry";
import { nodeRegistry } from "../registry";
import type { VangrexNode } from "../types/node-data";

interface PersistedNode {
  id: string;
  type: string;
  label: string;
  position: {
    x: number;
    y: number;
  };
  config: unknown;
}

export function createCanvasNode<TType extends NodeType>(
  type: TType,
  id: string,
  position: { x: number; y: number },
): VangrexNode {
  const definition = nodeRegistry.get(type);

  return {
    id,
    type: "vangrex",
    position,
    data: {
      label: definition.name,
      type,
      config: definition.config.parse({}),
    } as VangrexNode["data"],
  };
}

export function toCanvasNode(node: PersistedNode): VangrexNode | null {
  if (!nodeRegistry.has(node.type as NodeType)) {
    return null;
  }

  const type = node.type as NodeType;
  const definition = nodeRegistry.get(type);

  const result = definition.config.safeParse(node.config);

  if (!result.success) {
    return null;
  }

  return {
    id: node.id,
    type: "vangrex",
    position: node.position,
    data: {
      label: node.label,
      type,
      config: result.data,
    } as VangrexNode["data"],
  };
}

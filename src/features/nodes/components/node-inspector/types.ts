import type { VangrexNode } from "@/features/nodes/types/node-data";

export interface NodeInspectorProps {
  node: VangrexNode;

  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;

  onDelete: (nodeId: string) => void;

  onClose: () => void;
}

export interface NodeInspectorContentProps {
  node: VangrexNode;

  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

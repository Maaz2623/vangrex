import { Node } from "@xyflow/react";

export type OutputNodeData = {
  content: string;
};

export type OutputNode = Node<OutputNodeData, "outputNode">;

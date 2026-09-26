import { Node } from "@xyflow/react";

export type OutputNodeData = {
  format: "json" | "text";
};

export type OutputNode = Node<OutputNodeData, "outputNode">;

import { Node } from "@xyflow/react";

type OutputNodeData = {
  format: "json" | "text";
};

export type OutputNode = Node<OutputNodeData, "outputNode">;

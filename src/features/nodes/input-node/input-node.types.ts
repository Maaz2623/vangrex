import { Node } from "@xyflow/react";

export type InputNodeData = {
  value: string;
};

export type InputNode = Node<InputNodeData, "inputNode">;

import type { Node } from "@xyflow/react";
import type { z } from "zod";

import type { NodeRegiistryMap, NodeType } from "../registry";

type NodeData<K extends NodeType> = {
  label: string;
  type: K;
  config: z.infer<NodeRegiistryMap[K]["config"]>;
};

export type VangrexNodeData = {
  [K in NodeType]: NodeData<K>;
}[NodeType];

export type VangrexNode<K extends NodeType = NodeType> = Node<
  NodeData<K>,
  "vangrex"
>;

import type { Edge } from "@xyflow/react";

import { executeNode } from "./execute-node";
import { VangrexNode } from "../nodes/node-types";

export const executeWorkflow = async (nodes: VangrexNode[], edges: Edge[]) => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const inputNodes = nodes.filter((node) => node.type === "inputNode");

  const outputs = [];

  for (const inputNode of inputNodes) {
    let currentNode = inputNode;
    let data = currentNode.data;

    while (true) {
      // Execute current node
      const result = await executeNode(currentNode);

      // Find the edge leaving this node
      const outgoingEdge = edges.find((edge) => edge.source === currentNode.id);

      // No outgoing edge = end of this branch
      if (!outgoingEdge) {
        outputs.push(result);
        break;
      }

      // Find the next node
      const nextNode = nodeMap.get(outgoingEdge.target);

      if (!nextNode) {
        throw new Error(`Node ${outgoingEdge.target} not found`);
      }

      // Pass current result into next node
      data = result;
      currentNode = nextNode;
    }
  }

  return outputs;
};

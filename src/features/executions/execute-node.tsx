import { agentNodeDefinition } from "../nodes/agent-node/agent-node.definition";
import { inputNode } from "../nodes/input-node/input-node.definition";
import type { VangrexNode } from "../nodes/node-types";
import { outputNode } from "../nodes/output-node/output-node.definition";

export const executeNode = (node: VangrexNode, input?: unknown) => {
  switch (node.type) {
    case "inputNode":
      return inputNode.execute({
        data: node.data,
      });

    case "outputNode":
      return outputNode.execute({
        data: node.data,
      });

    case "agentNode":
      return agentNodeDefinition.execute({
        data: node.data,
      });
  }
};

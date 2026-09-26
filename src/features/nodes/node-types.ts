import { agentNodeDefinition } from "./agent-node/agent-node.definition";
import { AgentNode } from "./agent-node/agent-node.types";
import { InputNodeUI } from "./input-node/input-node";
import { inputNode } from "./input-node/input-node.definition";
import { InputNode } from "./input-node/input-node.types";
import { outputNode } from "./output-node/output-node.definition";
import { OutputNode } from "./output-node/output-node.types";

export const nodeTypes = {
  inputNode: inputNode.uiComponent,
  outputNode: outputNode.uiComponent,
  agentNode: agentNodeDefinition.uiComponent
};

export type VangrexNode = InputNode | OutputNode | AgentNode;

import { createNodeRegistry, type NodeMap } from "@vangrex/node-sdk";
import { inputNode } from "./definitions/core/input-node";
import { outputNode } from "./definitions/core/output-node";
import { generateNode } from "./definitions/ai/generate";

const nodes = {
  "core.input": inputNode,
  "core.output": outputNode,
  "ai.generate": generateNode,
} satisfies NodeMap;

export const nodeRegistry = createNodeRegistry(nodes);

export type NodeType = keyof typeof nodes;

export type NodeRegiistryMap = typeof nodes;


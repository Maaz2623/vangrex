import { Node } from "@xyflow/react";



export type AgentNodeData = {
    prompt: string
};


export type AgentNode = Node<AgentNodeData, "agentNode">
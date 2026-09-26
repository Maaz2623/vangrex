import { AgentNodeData } from "./agent-node.types";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { AgentNodeUI } from "./agent-node";

export const agentNodeDefinition = {
  type: "agentNode",

  uiComponent: AgentNodeUI,

  execute: async ({ data }: { data: AgentNodeData }) => {
    const model = google("gemini-3.5-flash-lite");

    const result = await generateText({
      model: model,
      prompt: data.prompt,
    });

    return result.text;
  },
};

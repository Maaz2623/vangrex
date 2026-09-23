import { Sparkles } from "lucide-react";
import { z } from "zod";

import { defineNode } from "../../define-node";

const generateConfigSchema = z.object({
  model: z.string(),
  temperature: z.number(),
  systemPrompt: z.string(),
});

export const generateNode = defineNode({
  type: "ai.generate",

  name: "Generate",

  description: "Generates text using an AI model.",

  category: "ai",

  icon: Sparkles,

  inputs: [
    {
      id: "prompt",
      name: "Prompt",
    },
  ],

  config: generateConfigSchema,

  configFields: [
    {
      key: "model",
      label: "Model",
      type: "select",
      options: [
        { label: "GPT-5.6", value: "gpt-5.6" },
        { label: "GPT-5.6 Mini", value: "gpt-5.6-mini" },
      ],
    },
    {
      key: "temperature",
      label: "Temperature",
      type: "number",
      description: "Controls randomness of generated output.",
    },
    {
      key: "maxTokens",
      label: "Max tokens",
      type: "number",
    },
  ],

  outputs: [
    {
      id: "message",
      name: "Message",
    },
  ],

  input: z.object({
    prompt: z.string(),
  }),

  output: z.object({
    text: z.string(),
  }),

  execute: async ({ input }) => {
    return {
      text: input.prompt,
    };
  },
});

import { Sparkles } from "lucide-react";
import { z } from "zod";

import { defineNode } from "../../define-node";

export const generateNode = defineNode({
  type: "ai.generate",
  name: "Generate",
  description: "Generates text using an AI model.",
  category: "ai",
  icon: Sparkles,

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

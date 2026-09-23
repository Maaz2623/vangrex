import { ArrowDown } from "lucide-react";
import { z } from "zod";

import { defineNode } from "../../define-node";

export const inputNode = defineNode({
  type: "core.input",
  name: "Input",
  description: "Provides input to a workflow.",
  category: "core",
  icon: ArrowDown,

  inputs: [],

  outputs: [
    {
      id: "value",
      name: "Value"
    }
  ],

  config: z.object({}),

  input: z.object({
    value: z.unknown(),
  }),

  output: z.object({
    value: z.unknown(),
  }),

  execute: async ({ input }) => {
    return input;
  },
});

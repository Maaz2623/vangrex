import { ArrowUp } from "lucide-react";
import { z } from "zod";

import { defineNode } from "../../define-node";

export const outputNode = defineNode({
  type: "core.output",
  name: "Output",
  description: "Returns the final workflow output.",
  category: "core",
  icon: ArrowUp,

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

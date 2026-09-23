import { z } from "zod";

import { defineNode } from "@vangrex/node-sdk";

export const helloNode = defineNode({
  type: "hello",
  name: "Hello",
  description: "Returns a greeting.",

  input: z.object({
    name: z.string(),
  }),

  output: z.object({
    message: z.string(),
  }),

  execute: async ({ input, context }) => {
    context.log("Generating greeting", {
      name: input.name,
    });

    const message = `Hello, ${input.name}!`;

    context.progress(100);

    return {
      message,
    };
  },
});

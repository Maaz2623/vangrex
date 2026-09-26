import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/workflows.procedure";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

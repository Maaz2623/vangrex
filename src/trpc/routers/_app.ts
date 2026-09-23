import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/workflows.procedure";
import { nodesRouter } from "@/features/nodes/server/nodes.procedure";
import { edgesRouter } from "@/features/edges/server/edges.procedure";

export const appRouter = createTRPCRouter({
    workflows: workflowsRouter,
    nodes: nodesRouter,
    edges: edgesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;

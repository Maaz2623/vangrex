import z from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { db } from "@/db";

import { workflowEdges, workflowNodes, workflowsTable } from "@/db/schema";

import { and, asc, eq } from "drizzle-orm";

import { TRPCError } from "@trpc/server";

const edgeSchema = z.object({
  id: z.uuid(),

  sourceNodeId: z.uuid(),

  targetNodeId: z.uuid(),

  sourceHandle: z.string().nullable().optional(),

  targetHandle: z.string().nullable().optional(),
});

export const edgesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const [workflow] = await db
        .select()
        .from(workflowsTable)
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.workflowId),
          ),
        );

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found.",
        });
      }

      return await db
        .select()
        .from(workflowEdges)
        .where(eq(workflowEdges.workflowId, input.workflowId))
        .orderBy(asc(workflowEdges.createdAt));
    }),

  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        edge: edgeSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [workflow] = await db
        .select()
        .from(workflowsTable)
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.workflowId),
          ),
        );

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found.",
        });
      }

      const [sourceNode] = await db
        .select()
        .from(workflowNodes)
        .where(
          and(
            eq(workflowNodes.id, input.edge.sourceNodeId),
            eq(workflowNodes.workflowId, input.workflowId),
          ),
        );

      if (!sourceNode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Source node not found.",
        });
      }

      const [targetNode] = await db
        .select()
        .from(workflowNodes)
        .where(
          and(
            eq(workflowNodes.id, input.edge.targetNodeId),
            eq(workflowNodes.workflowId, input.workflowId),
          ),
        );

      if (!targetNode) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Target node not found.",
        });
      }

      const [edge] = await db
        .insert(workflowEdges)
        .values({
          id: input.edge.id,
          workflowId: input.workflowId,
          sourceNodeId: input.edge.sourceNodeId,
          targetNodeId: input.edge.targetNodeId,
          sourceHandle: input.edge.sourceHandle,
          targetHandle: input.edge.targetHandle,
        })
        .returning();

      return edge;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        edgeId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [workflow] = await db
        .select()
        .from(workflowsTable)
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.workflowId),
          ),
        );

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found.",
        });
      }

      const [edge] = await db
        .delete(workflowEdges)
        .where(
          and(
            eq(workflowEdges.id, input.edgeId),
            eq(workflowEdges.workflowId, input.workflowId),
          ),
        )
        .returning();

      if (!edge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Edge not found.",
        });
      }

      return edge;
    }),
});

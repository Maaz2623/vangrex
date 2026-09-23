import z from "zod";

import { nodeRegistry, NodeType } from "../registry";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { db } from "@/db";

import { workflowNodes, workflowsTable } from "@/db/schema";

import { and, asc, eq } from "drizzle-orm";

import { TRPCError } from "@trpc/server";

const nodeTypeSchema = z
  .string()
  .refine((value): value is NodeType => nodeRegistry.has(value as NodeType), {
    error: "Invalid node type.",
  });

const nodePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const nodeConfigSchema = z.record(z.string(), z.unknown());

const nodeDataSchema = z.object({
  label: z.string().min(1),
  type: nodeTypeSchema,
  config: nodeConfigSchema,
});

export const nodesRouter = createTRPCRouter({
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
        .from(workflowNodes)
        .where(eq(workflowNodes.workflowId, input.workflowId))
        .orderBy(asc(workflowNodes.createdAt));
    }),

  create: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),

        id: z.string().uuid(),

        position: nodePositionSchema,

        data: nodeDataSchema,
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

      const [node] = await db
        .insert(workflowNodes)
        .values({
          id: input.id,
          workflowId: input.workflowId,
          type: input.data.type,
          label: input.data.label,
          position: input.position,
          config: input.data.config,
        })
        .returning();

      return node;
    }),

  update: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        nodeId: z.string().uuid(),

        position: nodePositionSchema.optional(),

        data: z
          .object({
            label: z.string().min(1).optional(),
            type: nodeTypeSchema.optional(),
            config: nodeConfigSchema.optional(),
          })
          .optional(),
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

      const values: Partial<typeof workflowNodes.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (input.position) {
        values.position = input.position;
      }

      if (input.data?.label !== undefined) {
        values.label = input.data.label;
      }

      if (input.data?.type !== undefined) {
        values.type = input.data.type;
      }

      if (input.data?.config !== undefined) {
        values.config = input.data.config;
      }

      const [node] = await db
        .update(workflowNodes)
        .set(values)
        .where(
          and(
            eq(workflowNodes.id, input.nodeId),
            eq(workflowNodes.workflowId, input.workflowId),
          ),
        )
        .returning();

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found.",
        });
      }

      return node;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        nodeId: z.string().uuid(),
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

      const [node] = await db
        .delete(workflowNodes)
        .where(
          and(
            eq(workflowNodes.id, input.nodeId),
            eq(workflowNodes.workflowId, input.workflowId),
          ),
        )
        .returning();

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found.",
        });
      }

      return node;
    }),
});

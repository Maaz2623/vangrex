import { db } from "@/db";
import { workflowsTable } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [workflow] = await db
        .insert(workflowsTable)
        .values({
          name: input.name,
          description: input.description,
          userId: ctx.auth.user.id,
        })
        .returning();

      return workflow;
    }),
  getWorkflows: protectedProcedure.query(async ({ input, ctx }) => {
    const workflows = await db
      .select()
      .from(workflowsTable)
      .where(eq(workflowsTable.userId, ctx.auth.user.id));

    return workflows;
  }),
  updateWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedWorkflow] = await db
        .update(workflowsTable)
        .set({
          name: input.name,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.workflowId),
          ),
        )
        .returning({
          id: workflowsTable.id,
        });

      if (!updatedWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return updatedWorkflow.id;
    }),
  deleteWorkflow: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [deletedWorkflow] = await db
        .delete(workflowsTable)
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.workflowId),
          ),
        )
        .returning({
          id: workflowsTable.id,
        });

      if (!deletedWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      return deletedWorkflow.id;
    }),

  getWorkflow: protectedProcedure
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
            eq(workflowsTable.id, input.workflowId),
            eq(workflowsTable.userId, ctx.auth.user.id),
          ),
        );

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found.",
        });
      }

      return workflow;
    }),
});

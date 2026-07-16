import { Output, ToolLoopAgent } from "ai";
import { z } from "zod";
import { gemini } from "../../model";
import { DATABASE_AGENT_INSTRUCTIONS } from "./general-instructions";

const DatabaseOutputSchema = z.object({
  summary: z.object({
    database: z.enum([
      "postgresql",
      "mysql",
      "sqlite",
      "mongodb",
      "supabase",
      "planetscale",
      "neon",
    ]),

    orm: z.enum(["drizzle", "prisma", "typeorm", "mongoose", "none"]),

    driver: z.string(),

    reasoning: z.string(),
  }),

  packages: z.array(
    z.object({
      name: z.string(),
      version: z.string().optional(),
      dev: z.boolean(),
      reason: z.string(),
    }),
  ),

  environment: z.array(
    z.object({
      key: z.string(),
      required: z.boolean(),
      example: z.string().optional(),
      description: z.string(),
    }),
  ),

  folders: z.array(
    z.object({
      path: z.string(),
      reason: z.string(),
    }),
  ),

  files: z.array(
    z.object({
      path: z.string(),
      purpose: z.string(),

      language: z.enum(["ts", "sql", "json", "env", "yaml"]),

      generator: z.enum(["database-agent", "backend-agent"]),

      overwrite: z.boolean(),
    }),
  ),

  enums: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string()),
    }),
  ),

  tables: z.array(
    z.object({
      name: z.string(),

      description: z.string(),

      columns: z.array(
        z.object({
          name: z.string(),

          type: z.string(),

          nullable: z.boolean(),

          primaryKey: z.boolean(),

          unique: z.boolean(),

          default: z.string().optional(),

          references: z
            .object({
              table: z.string(),
              column: z.string(),
              onDelete: z.string().optional(),
              onUpdate: z.string().optional(),
            })
            .optional(),
        }),
      ),

      indexes: z.array(
        z.object({
          columns: z.array(z.string()),
          unique: z.boolean(),
        }),
      ),

      constraints: z.array(
        z.object({
          type: z.string(),
          expression: z.string(),
        }),
      ),
    }),
  ),

  seeds: z.array(
    z.object({
      name: z.string(),
      required: z.boolean(),
      description: z.string(),
    }),
  ),

  generatedFiles: z.array(
    z.object({
      path: z.string(),

      type: z.enum([
        "drizzle-schema",
        "prisma-schema",
        "migration",
        "seed",
        "config",
      ]),

      content: z.string(),
    }),
  ),

  executionPlan: z.array(
    z.object({
      id: z.string(),

      title: z.string(),

      type: z.enum([
        "install",
        "write-file",
        "mkdir",
        "generate",
        "migrate",
        "seed",
      ]),

      dependsOn: z.array(z.string()),

      data: z.record(z.string(), z.any()),
    }),
  ),

  expectedOutputs: z.object({
    migrationFolder: z.string(),

    schemaFile: z.string(),

    seedFile: z.string().optional(),

    configFile: z.string(),
  }),
});

export const databaseAgent = new ToolLoopAgent({
  model: gemini,
  output: Output.object({
    schema: DatabaseOutputSchema,
  }),
  instructions: DATABASE_AGENT_INSTRUCTIONS,
});

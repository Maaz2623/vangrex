import { Output, ToolLoopAgent } from "ai";
import { z } from "zod";
import { gemini } from "../../model";
import { ARCHITECTURE_AGENT_INSTRUCTIONS } from "./general-instructions";

const Complexity = z.enum(["XS", "S", "M", "L", "XL"]);

const ArchitectureStyle = z.enum([
  "Static",
  "SPA",
  "SSR",
  "Hybrid",
  "Monolith",
  "ModularMonolith",
  "Microservices",
  "Serverless",
  "EventDriven",
]);

const Layer = z.enum(["Frontend", "Backend", "Database", "Infrastructure"]);

const Technology = z.object({
  category: z.string(),
  name: z.string(),
  version: z.string().optional(),
  reason: z.string(),
  alternativesConsidered: z.array(z.string()),
});

const Capability = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  modules: z.array(z.string()),
});

const Module = z.object({
  id: z.string(),
  name: z.string(),
  responsibility: z.string(),

  capability: z.string(),

  layer: Layer,

  dependencies: z.array(z.string()),

  exposes: z.array(z.string()),

  consumes: z.array(z.string()),

  notes: z.array(z.string()),
});

const Entity = z.object({
  name: z.string(),

  purpose: z.string(),

  relationships: z.array(
    z.object({
      entity: z.string(),
      type: z.string(),
    }),
  ),
});

const Endpoint = z.object({
  name: z.string(),

  method: z.string(),

  path: z.string(),

  purpose: z.string(),

  module: z.string(),
});

const Integration = z.object({
  name: z.string(),

  purpose: z.string(),

  required: z.boolean(),

  module: z.string(),
});

const DataFlow = z.object({
  id: z.string(),

  name: z.string(),

  steps: z.array(z.string()),
});

const SecurityRule = z.object({
  title: z.string(),

  description: z.string(),
});

const PerformanceRule = z.object({
  title: z.string(),

  description: z.string(),
});

const Deployment = z.object({
  frontend: z.string(),

  backend: z.string(),

  database: z.string(),

  storage: z.string().optional(),

  cdn: z.string().optional(),
});

const ADR = z.object({
  id: z.string(),

  title: z.string(),

  decision: z.string(),

  rationale: z.string(),

  alternatives: z.array(z.string()),

  consequences: z.array(z.string()),
});

export const ArchitectureSchema = z.object({
  summary: z.object({
    architectureStyle: ArchitectureStyle,

    complexity: Complexity,

    rationale: z.string(),
  }),

  technologies: z.array(Technology),

  capabilities: z.array(Capability),

  modules: z.array(Module),

  frontend: z.object({
    routing: z.string(),

    stateManagement: z.string(),

    componentStrategy: z.string(),

    renderingStrategy: z.string(),

    folderStrategy: z.string(),
  }),

  backend: z.object({
    apiStyle: z.string(),

    serviceOrganization: z.string(),

    validationStrategy: z.string(),

    errorHandling: z.string(),

    authentication: z.string(),

    authorization: z.string(),
  }),

  database: z.object({
    type: z.string(),

    orm: z.string(),

    entities: z.array(Entity),

    indexingStrategy: z.array(z.string()),

    constraints: z.array(z.string()),
  }),

  apis: z.array(Endpoint),

  integrations: z.array(Integration),

  dataFlows: z.array(DataFlow),

  security: z.array(SecurityRule),

  performance: z.array(PerformanceRule),

  scalability: z.object({
    currentTarget: z.string(),

    scalingStrategy: z.string(),

    bottlenecks: z.array(z.string()),
  }),

  deployment: Deployment,

  monitoring: z.object({
    logging: z.string(),

    analytics: z.string(),

    errorTracking: z.string(),

    metrics: z.string(),
  }),

  codingStandards: z.array(z.string()),

  architectureDecisions: z.array(ADR),

  implementationReadiness: z.object({
    ready: z.boolean(),

    blockers: z.array(z.string()),

    recommendedNextAgents: z.array(z.string()),
  }),
});

export const architectureAgent = new ToolLoopAgent({
  model: gemini,
  output: Output.object({
    schema: ArchitectureSchema,
  }),
  instructions: ARCHITECTURE_AGENT_INSTRUCTIONS,
});

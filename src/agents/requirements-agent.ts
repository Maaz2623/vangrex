import { Output, ToolLoopAgent } from "ai";
import { gemini } from "../../model";
import { REQUIREMENT_AGENT_INSTRUCTIONS } from "./general-instructions";

import { z } from "zod";

export const RequirementStatus = z.enum([
  "Confirmed",
  "Inferred",
  "Pending",
  "Rejected",
]);

export const RequirementPriority = z.enum([
  "Critical",
  "High",
  "Medium",
  "Low",
]);

export const RequirementSource = z.enum([
  "UserPrompt",
  "UserAnswer",
  "Research",
  "Inference",
]);

const RequirementMetadata = z.object({
  priority: RequirementPriority,
  status: RequirementStatus,
  source: RequirementSource,
  rationale: z.string(),
  dependencies: z.array(z.string()),
});

const FunctionalRequirement = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  metadata: RequirementMetadata,
});

const BusinessRule = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  metadata: RequirementMetadata,
});

const Entity = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),

  attributes: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      required: z.boolean(),
    }),
  ),

  relationships: z.array(
    z.object({
      entity: z.string(),
      relationship: z.string(),
    }),
  ),

  metadata: RequirementMetadata,
});

const Workflow = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string(),

  actors: z.array(z.string()),

  steps: z.array(
    z.object({
      order: z.number(),
      action: z.string(),
    }),
  ),

  metadata: RequirementMetadata,
});

const Integration = z.object({
  id: z.string(),

  name: z.string(),

  purpose: z.string(),

  required: z.boolean(),

  metadata: RequirementMetadata,
});

const Question = z.object({
  id: z.string(),

  topic: z.string(),

  question: z.string(),

  blocking: z.boolean(),

  relatedRequirements: z.array(z.string()),
});

export const RequirementsSchema = z.object({
  project: z.object({
    name: z.string(),

    description: z.string(),

    category: z.string(),

    domain: z.string(),

    objectives: z.array(z.string()),

    targetUsers: z.array(z.string()),
  }),

  userRoles: z.array(
    z.object({
      id: z.string(),

      name: z.string(),

      description: z.string(),

      goals: z.array(z.string()),

      permissions: z.array(z.string()),

      metadata: RequirementMetadata,
    }),
  ),

  functionalRequirements: z.array(FunctionalRequirement),

  candidateFunctionalRequirements: z.array(FunctionalRequirement),

  nonFunctionalRequirements: z.object({
    confirmed: z.array(z.string()),

    candidate: z.array(z.string()),
  }),

  businessRules: z.array(BusinessRule),

  entities: z.array(Entity),

  workflows: z.array(Workflow),

  integrations: z.object({
    confirmed: z.array(Integration),

    candidate: z.array(Integration),
  }),

  assumptions: z.array(
    z.object({
      id: z.string(),

      assumption: z.string(),

      reason: z.string(),
    }),
  ),

  outOfScope: z.array(
    z.object({
      id: z.string(),

      description: z.string(),
    }),
  ),

  acceptanceCriteria: z.array(
    z.object({
      requirementId: z.string(),

      scenarios: z.array(z.string()),
    }),
  ),

  unresolvedQuestions: z.array(Question),

  readiness: z.object({
    readyForPlanning: z.boolean(),

    completenessScore: z.number().min(0).max(100),

    missingCriticalInformation: z.array(z.string()),
  }),
});

export const requirementsAgent = new ToolLoopAgent({
  model: gemini,
  output: Output.object({
    schema: RequirementsSchema,
  }),
  instructions: REQUIREMENT_AGENT_INSTRUCTIONS,
});

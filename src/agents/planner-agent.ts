import { Output, ToolLoopAgent } from "ai";
import { z } from "zod";
import { gemini } from "../../model";
import { PLANNER_AGENT_INSTRUCTIONS } from "./general-instructions";

const Priority = z.enum(["Critical", "High", "Medium", "Low"]);

const Complexity = z.enum(["XS", "S", "M", "L", "XL"]);

const Status = z.enum(["Planned", "Blocked", "Optional"]);

const UserStory = z.object({
  id: z.string(),

  title: z.string(),

  story: z.string(), // As a..., I want..., so that...

  acceptanceCriteria: z.array(z.string()),

  priority: Priority,

  complexity: Complexity,

  dependencies: z.array(z.string()),
});

const Feature = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string(),

  priority: Priority,

  complexity: Complexity,

  dependencies: z.array(z.string()),

  userStories: z.array(UserStory),
});

const Module = z.object({
  id: z.string(),

  name: z.string(),

  purpose: z.string(),

  priority: Priority,

  complexity: Complexity,

  dependencies: z.array(z.string()),

  features: z.array(Feature),
});

const Milestone = z.object({
  id: z.string(),

  name: z.string(),

  goal: z.string(),

  modules: z.array(z.string()),

  completionCriteria: z.array(z.string()),
});

const Phase = z.object({
  id: z.string(),

  name: z.string(),

  description: z.string(),

  milestones: z.array(z.string()),
});

const Risk = z.object({
  id: z.string(),

  description: z.string(),

  impact: z.enum(["Low", "Medium", "High"]),

  mitigation: z.string(),
});

export const PlanningSchema = z.object({
  summary: z.object({
    projectType: z.string(),

    scope: z.string(),

    estimatedComplexity: Complexity,

    totalModules: z.number(),

    totalFeatures: z.number(),
  }),

  modules: z.array(Module),

  milestones: z.array(Milestone),

  phases: z.array(Phase),

  risks: z.array(Risk),

  buildOrder: z.array(z.string()),

  dependencyGraph: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
    }),
  ),

  planningReadiness: z.object({
    readyForArchitecture: z.boolean(),

    blockers: z.array(z.string()),
  }),
});

export const plannerAgent = new ToolLoopAgent({
  model: gemini,
  output: Output.object({
    schema: PlanningSchema,
  }),
  instructions: PLANNER_AGENT_INSTRUCTIONS,
});

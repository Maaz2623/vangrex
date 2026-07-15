import { Output, ToolLoopAgent } from "ai";
import { gemini } from "../../model";
import z from "zod";
import { RESEARCH_AGENT_INSTRUCTIONS } from "./general-instructions";

const ResearchSchema = z.object({
  projectCategories: z.array(z.string()),
  summary: z.string(),
  interpretation: z.object({
    projectType: z.string(),
    domain: z.string(),
    intendedPurpose: z.string(),
    confidence: z.number().min(0).max(1),
  }),
  domainKnowledge: z.object({
    overview: z.string(),
    userTypes: z.array(z.string()),
    terminology: z.array(
      z.object({
        term: z.string(),
        definition: z.string(),
      }),
    ),
    commonFeatures: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    ),
    advancedFeatures: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
      }),
    ),
    commonWorkflows: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        steps: z.array(z.string()),
      }),
    ),
  }),
  marketResearch: z.object({
    similarProducts: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        notableFeatures: z.array(z.string()),
      }),
    ),
    competitors: z.array(z.string()),
    industryStandards: z.array(z.string()),
    marketTrends: z.array(z.string()),
    userExpectations: z.array(z.string()),
  }),
  regulations: z.object({
    legal: z.array(z.string()),
    compliance: z.array(z.string()),
    privacy: z.array(z.string()),
    accessibility: z.array(z.string()),
  }),
  constraints: z.object({
    technical: z.array(z.string()),
    business: z.array(z.string()),
    operational: z.array(z.string()),
  }),
  assumptions: z.array(
    z.object({
      assumption: z.string(),
      reason: z.string(),
    }),
  ),
  ambiguities: z.array(
    z.object({
      topic: z.string(),
      reason: z.string(),
      questionForRequirements: z.string(),
    }),
  ),
  references: z.array(
    z.object({
      title: z.string(),
      url: z.url(),
      sourceType: z.enum([
        "Official",
        "Documentation",
        "Competitor",
        "Research",
        "Article",
        "Other",
      ]),
    }),
  ),
  researchMetadata: z.object({
    searchedTopics: z.array(z.string()),
    keywords: z.array(z.string()),
    confidence: z.number().min(0).max(1),
  }),
});

export const researchAgent = new ToolLoopAgent({
  model: gemini,
  output: Output.object({
    schema: ResearchSchema,
  }),
  instructions: RESEARCH_AGENT_INSTRUCTIONS,
});

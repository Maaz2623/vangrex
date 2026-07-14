import { z } from "zod";

export const RequirementDiscoverySchema = z.object({
  complete: z.boolean(),

  answers: z.object({
    projectName: z.string().optional(),
    projectType: z.string().optional(),
    businessDescription: z.string().optional(),

    targetUsers: z.array(z.string()).default([]),

    coreFeatures: z.array(z.string()).default([]),

    pages: z.array(z.string()).default([]),

    adminPanel: z.boolean().optional(),

    authentication: z.boolean().optional(),

    paymentGateway: z.boolean().optional(),

    technologies: z.array(z.string()).default([]),

    integrations: z.array(z.string()).default([]),

    designStyle: z.string().optional(),

    additionalRequirements: z.array(z.string()).default([]),
  }),

  missingInformation: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      reason: z.string(),
    }),
  ),

  assumptions: z.array(z.string()).default([]),
});

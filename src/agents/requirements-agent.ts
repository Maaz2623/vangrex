import { ToolLoopAgent } from "ai";
import { gemini } from "../../model";
import * as z from 'zod'

const RequirementsSchema = z.object({})



export const requirementsAgent = new ToolLoopAgent({
    model: gemini,

    instructions: `U understand the user's prompt and make a structured requirements json schema`
})
import { requirementsAgent } from "@/agents/requirements-agent";
import { researchAgent } from "@/agents/research-agent";

import researchOutput from "./src/outputs/research.json";
import requirementsOutput from "./src/outputs/requirements.json";
import planOutput from "./src/outputs/plan.json";
import architectureOutput from "./src/outputs/architecture.json";

import { plannerAgent } from "@/agents/planner-agent";
import { architectureAgent } from "@/agents/architecture-agent";
import { databaseAgent } from "@/agents/database-agent";

async function main() {
  const userPrompt = "Create a real estate landing page.";

  // console.log("============== Research Agent Started ===================");

  // const research = await researchAgent.generate({
  //   prompt: userPrompt,
  // });

  // console.log("============== Requirements Agent Started ===================");

  // const requirements = await requirementsAgent.generate({
  //   prompt: `
  //   USER_PROMPT: ${userPrompt}

  //   RESEARCH_AGENT_OUTPUT: ${JSON.stringify(researchOutput, null, 2)}
  //   `,
  // });

  // console.log("============== Planner Agent Started ===================");

  // const plan = await plannerAgent.generate({
  //   prompt: `
  //   USER_PROMPT: ${userPrompt}

  //   REQUIREMENTS_AGENT_OUTPUT: ${JSON.stringify(requirementsOutput, null, 2)}
  //   `,
  // });

  // console.log("============== Architecture Agent Started ===================");

  // const architecture = await architectureAgent.generate({
  //   prompt: `
  //   USER_PROMPT: ${userPrompt}

  //   REQUIREMENTS_AGENT_OUTPUT: ${JSON.stringify(planOutput, null, 2)}
  //   `,
  // });

  console.log("============== Database Agent Started ===================");

  const database = await databaseAgent.generate({
    prompt: `
    REQUIREMENTS_AGENT_OUTPUT: ${JSON.stringify(requirementsOutput, null, 2)}
    ARCHITECTURE_AGENT_OUTPUT: ${JSON.stringify(architectureOutput, null, 2)}
    `,
  });

  console.log(JSON.stringify(database.output, null, 2));
}

main().catch(console.error);

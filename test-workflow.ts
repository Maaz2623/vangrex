import { researchAgent } from "@/agents/research-agent";

async function main() {
  const userPrompt = "Create a real estate landing page.";

  console.log("============== Research Agent Started ===================");

  const research = await researchAgent.generate({
    prompt: userPrompt,
  });

  console.log(JSON.stringify(research.output, null, 2));
}

main().catch(console.error);

import { executeNode } from "@/features/executions/execute-node";

async function main() {
  const result = executeNode({
    id: "agentNode",
    type: "agentNode",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      prompt: "Hi How are u?",
    },
  });
  console.log(result);
}

main().catch((error) => console.error(error));

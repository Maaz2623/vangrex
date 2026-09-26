import { outputNode } from "@/features/nodes/output-node/output-node.definition";

async function main() {
  const result = await outputNode.execute({
    data: {
      format: "text",
    },
  });

  console.log(result);
}

main().catch((error) => console.error(error));

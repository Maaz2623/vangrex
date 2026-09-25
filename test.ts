import { inputNode, outputNode } from "@/features/canvas/components/canvas";

async function main() {
  const result = await outputNode.execute({
    data: {
      format: "text",
    },
    input: "Hello World",
  });

  console.log(result);
}

main().catch((error) => console.error(error));

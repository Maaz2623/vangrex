import { outputNode } from "@/features/canvas/components/canvas";

async function main() {
  const result = outputNode.execute({
    data: {
      format: "text",
    },
    input: "Hello World",
  });

  console.log(result.value);
}

main().catch((error) => console.error(error));

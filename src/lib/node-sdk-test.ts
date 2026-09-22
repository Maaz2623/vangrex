import {
  createNodeRegistry,
  ExecutionContext,
  helloNode,
} from "@vangrex/node-sdk";

const registry = createNodeRegistry({
  heello: helloNode,
});

const context: ExecutionContext = {
  workflowId: "workflow-1",
  executionId: "execution-1",
  nodeId: "node-1",

  emit(event) {
    console.log("[EVENT]", event);
  },

  log(message, data) {
    console.log("[LOG]", message, data);
  },

  progress(value) {
    console.log("[PROGRESS]", value);
  },
};

const node = registry.get("heello");

const result = await node.execute({
  input: {
    name: "Vangrex",
  },
  context,
});

console.log(result);

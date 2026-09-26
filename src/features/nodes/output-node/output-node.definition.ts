import { OutputNodeUI } from "./output-node";
import { OutputNode, OutputNodeData } from "./output-node.types";

export const outputNode = {
  type: "outputNode",

  uiComponent: OutputNodeUI,

  execute: ({ data }: { data: OutputNodeData }) => {
    console.log(data);

    return data;
  },
};

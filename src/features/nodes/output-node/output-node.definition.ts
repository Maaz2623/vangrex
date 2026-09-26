import { OutputNodeUI } from "./output-node";
import { OutputNode } from "./output-node.types";

export const outputNode = {
  type: "outputNode",

  uiComponent: OutputNodeUI,

  execute: ({ data }: { data: OutputNode }) => {
    console.log(data);

    return data;
  },
};

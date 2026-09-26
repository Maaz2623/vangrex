import { InputNodeUI } from "./input-node";
import { InputNodeData } from "./input-node.types";

export const inputNode = {
  type: "inputNode",

  uiComponent: InputNodeUI,

  execute: ({ data }: { data: InputNodeData }) => {
    console.log("Input node executed");
    return data;
  },
};

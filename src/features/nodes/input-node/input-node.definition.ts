import { InputNodeUI } from "./input-node";
import { InputNodeData } from "./input-node.types";

export type NodeStatus = "pending" | "running" | "success" | "error";

export const inputNode = {
  type: "inputNode",
  uiComponent: InputNodeUI,
  status: "pending" as NodeStatus,

  execute: ({ data }: { data: InputNodeData }) => {
    console.log("Input node executed");
    return data;
  },
};

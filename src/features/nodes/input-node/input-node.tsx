import { ArrowDown } from "lucide-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { InputNode } from "./input-node.types";

export const InputNodeUI = ({ data, id }: NodeProps<InputNode>) => {
  console.log(data.value);

  return (
    <div className="rounded-lg border bg-background px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
          <ArrowDown className="size-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-sm font-medium">{data.value}</p>
          <p className="text-xs text-muted-foreground">Workflow input</p>
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="value">
        Value
      </Handle>
    </div>
  );
};

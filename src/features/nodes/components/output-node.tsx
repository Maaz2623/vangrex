import { ArrowUp } from "lucide-react";

import { Handle, Position } from "@xyflow/react";

export const OutputNode = () => {
  return (
    <div className="rounded-lg border bg-background px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-muted">
          <ArrowUp className="size-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-sm font-medium">Output</p>
          <p className="text-xs text-muted-foreground">Workflow output</p>
        </div>
      </div>

      <Handle type="target" position={Position.Left} id="value" />
    </div>
  );
};

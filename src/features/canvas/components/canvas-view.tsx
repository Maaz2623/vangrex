"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { Canvas } from "./canvas";
import "@xyflow/react/dist/style.css";

export const CanvasView = ({ workflowId }: { workflowId: string }) => {
  return (
    <div className="h-full w-full bg-background rounded-xl border">
      <ReactFlowProvider>
        <Canvas workflowId={workflowId} />
      </ReactFlowProvider>
    </div>
  );
};

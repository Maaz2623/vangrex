"use client";

import { useMemo } from "react";

import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Node,
  Position,
  ReactFlow,
  useNodesState,
} from "@xyflow/react";
import { nodeTypes, VangrexNode } from "@/features/nodes/node-types";

const initialNodes: VangrexNode[] = [
  {
    id: "input",
    type: "inputNode",
    position: { x: 0, y: 150 },
    data: {
      value: "Hello World",
    },
  },
  {
    id: "output",
    type: "outputNode",
    position: { x: 350, y: 150 },
    data: {
      format: "json",
    },
  },
];

export const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: false,
      style: {
        stroke: "color-mix(in oklch, var(--muted-foreground) 45%, transparent)",
        strokeWidth: 1.5,
      },
    }),
    [],
  );

  return (
    <div className="relative h-[calc(100vh-5.5rem)] overflow-hidden rounded-xl bg-background">
      <ReactFlow
        defaultEdgeOptions={defaultEdgeOptions}
        nodes={nodes}
        colorMode="light"
        className="bg-background"
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      >
        <Background
          gap={24}
          size={1}
          color="color-mix(in oklch, var(--foreground) 60%, transparent)"
        />

        <Controls
          showInteractive={false}
          className="!m-4 !overflow-hidden !rounded-lg !border !border-border !bg-background !shadow-sm"
        />

        <MiniMap
          nodeColor="color-mix(in oklch, var(--foreground) 20%, var(--background))"
          maskColor="color-mix(in oklch, var(--background) 80%, transparent)"
          className="!m-4 !overflow-hidden !rounded-lg !border !border-border !bg-background !shadow-sm"
        />
      </ReactFlow>
    </div>
  );
};

"use client";

import { useCallback, useMemo } from "react";

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Handle,
  MiniMap,
  Node,
  Panel,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { nodeTypes, VangrexNode } from "@/features/nodes/node-types";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

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
    id: "agentNode",
    type: "agentNode",
    position: { x: 350, y: 150 },
    data: {
      prompt: "",
    },
  },

  {
    id: "output",
    type: "outputNode",
    position: { x: 700, y: 150 },
    data: {
      content: "",
    },
  },
];

const initialEdges = [
  {
    id: "input-agent",
    source: "input",
    sourceHandle: "output",
    target: "agentNode",
    targetHandle: "input",
  },
  {
    id: "agent-output",
    source: "agentNode",
    sourceHandle: "output", // ✅
    target: "output",
    targetHandle: "value",
  },
];

export const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState(initialEdges);

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

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges],
  );

  return (
    <div className="relative h-[calc(100vh-5.5rem)] overflow-hidden rounded-xl bg-background">
      <ReactFlow
        defaultEdgeOptions={defaultEdgeOptions}
        edges={edges}
        onEdgesChange={onEdgeChange}
        nodes={nodes}
        colorMode="light"
        className="bg-background"
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
      >
        <Panel className="">
          <Button>
            <PlayIcon />
            Trigger
          </Button>
        </Panel>
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

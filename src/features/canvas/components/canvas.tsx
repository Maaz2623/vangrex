"use client";

import { useCallback, useMemo, useState } from "react";

import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { Bot, Plus, Upload, Download, Search } from "lucide-react";

import { nodeTypes, VangrexNode } from "@/features/nodes/node-types";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    sourceHandle: "output",
    target: "output",
    targetHandle: "value",
  },
];

interface Props {
  workflowId: string;
}

const availableNodes = [
  {
    type: "inputNode",
    name: "Input",
    description: "Provide data to your workflow.",
    icon: Upload,
  },
  {
    type: "agentNode",
    name: "AI Agent",
    description: "Process data with an AI agent.",
    icon: Bot,
  },
  {
    type: "outputNode",
    name: "Output",
    description: "Return the final workflow result.",
    icon: Download,
  },
] as const;

export const Canvas = ({ workflowId }: Props) => {
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

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [nodeSearch, setNodeSearch] = useState("");

  const filteredNodes = useMemo(() => {
    const search = nodeSearch.trim().toLowerCase();

    if (!search) {
      return availableNodes;
    }

    return availableNodes.filter(
      (node) =>
        node.name.toLowerCase().includes(search) ||
        node.description.toLowerCase().includes(search),
    );
  }, [nodeSearch]);

  const addNode = useCallback(
    (type: VangrexNode["type"]) => {
      const id = `${type}-${crypto.randomUUID()}`;

      let node: VangrexNode;

      switch (type) {
        case "inputNode":
          node = {
            id,
            type: "inputNode",
            position: {
              x: 200,
              y: 200,
            },
            data: {
              value: "",
            },
          };
          break;

        case "agentNode":
          node = {
            id,
            type: "agentNode",
            position: {
              x: 200,
              y: 200,
            },
            data: {
              prompt: "",
            },
          };
          break;

        case "outputNode":
          node = {
            id,
            type: "outputNode",
            position: {
              x: 200,
              y: 200,
            },
            data: {
              content: "",
            },
          };
          break;
      }

      setNodes((nodes) => [...nodes, node]);
      setAddNodeOpen(false);
    },
    [setNodes],
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
        <Panel position="top-left" className="!m-4 flex items-center gap-2">
          <Button
            onClick={() => setAddNodeOpen(true)}
            variant="outline"
            className="gap-2 shadow-sm"
          >
            <Plus className="size-4" />
            Add node
          </Button>

          <Button className="gap-2 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
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

      <Dialog
        open={addNodeOpen}
        onOpenChange={(open) => {
          setAddNodeOpen(open);

          if (!open) {
            setNodeSearch("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add a node</DialogTitle>

            <DialogDescription>
              Choose a node to add to your workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={nodeSearch}
              onChange={(event) => setNodeSearch(event.target.value)}
              placeholder="Search nodes..."
              className="h-9 pl-9"
            />
          </div>

          <div className="space-y-1">
            {filteredNodes.map((node) => {
              const Icon = node.icon;

              return (
                <button
                  key={node.type}
                  type="button"
                  onClick={() => addNode(node.type)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-muted/50"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                    <Icon className="size-4 text-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{node.name}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  </div>

                  <Plus className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}

            {filteredNodes.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-medium">No nodes found</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Try searching for a different node.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

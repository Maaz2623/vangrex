"use client";

import { useCallback, useMemo, useState } from "react";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddNodeDialog } from "@/features/nodes/components/add-node-dialog";
import { NodeDialog } from "@/features/nodes/components/node-dialog";
import { nodeRegistry } from "@/features/nodes";
import { toCanvasNode } from "@/features/nodes/utils/to-canvas-node";
import { NodeType } from "@/features/nodes/registry";

interface Props {
  workflowId: string;
}

const initialNodes: Node[] = [
  toCanvasNode(nodeRegistry.get("core.input"), "n1", { x: 100, y: 150 }),
  toCanvasNode(nodeRegistry.get("ai.generate"), "n2", { x: 400, y: 150 }),
  toCanvasNode(nodeRegistry.get("core.output"), "n3", { x: 700, y: 150 }),
];

const initialEdges: Edge[] = [
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
  },
];

export const Canvas = ({ workflowId }: Props) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodesChange: OnNodesChange = useCallback((changes) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((edgesSnapshot) => addEdge(connection, edgesSnapshot));
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const definition = nodeRegistry.get(type);

    const id = `node-${Date.now()}`;

    const newNode: Node = {
      id,
      type: "default",
      position: {
        x: 250,
        y: 150,
      },
      data: {
        label: definition.name,
        type: definition.type,
      },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);

    setAddNodeOpen(false);
    setSelectedNode(newNode);
  }, []);

  const updateNode = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              }
            : node,
        ),
      );

      setSelectedNode((currentNode) =>
        currentNode?.id === nodeId
          ? {
              ...currentNode,
              data: {
                ...currentNode.data,
                ...data,
              },
            }
          : currentNode,
      );
    },
    [],
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeId),
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    );

    setSelectedNode(null);
  }, []);

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
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
        colorMode="light"
        className="bg-background"
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background
          gap={24}
          size={1}
          color="color-mix(in oklch, var(--foreground) 8%, transparent)"
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

      {/* Canvas actions */}
      <div className="absolute left-4 top-4 z-10">
        <Button
          onClick={() => setAddNodeOpen(true)}
          size="sm"
          className="shadow-sm"
        >
          <Plus className="size-4" />
          Add node
        </Button>
      </div>

      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        onAddNode={addNode}
      />

      <NodeDialog
        node={selectedNode}
        open={Boolean(selectedNode)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedNode(null);
          }
        }}
        onUpdate={updateNode}
        onDelete={deleteNode}
      />
    </div>
  );
};

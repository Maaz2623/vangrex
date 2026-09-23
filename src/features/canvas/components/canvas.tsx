"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { GitBranch, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddNodeDialog } from "@/features/nodes/components/add-node-dialog";
import { NodeInspector } from "@/features/nodes/components/node-inspector";
import { CanvasNode } from "@/features/nodes/components/canvas-node";

import { nodeRegistry } from "@/features/nodes";
import { NodeType } from "@/features/nodes/registry";

import { VangrexNode, VangrexNodeData } from "@/features/nodes/types/node-data";

import { toCanvasNode } from "@/features/nodes/utils/to-canvas-node";

import {
  useCreateNode,
  useDeleteNode,
  useNodes,
  useUpdateNode,
} from "@/features/nodes/hooks/use-nodes";

import {
  useCreateEdge,
  useDeleteEdge,
  useEdges,
} from "@/features/edges/hooks/use-edges";

interface Props {
  workflowId: string;
}

export const Canvas = ({ workflowId }: Props) => {
  const [nodes, setNodes] = useState<VangrexNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<VangrexNode | null>(null);

  const { data: savedNodes } = useNodes(workflowId);
  const { data: savedEdges } = useEdges(workflowId);

  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();

  const createEdge = useCreateEdge();
  const deleteEdge = useDeleteEdge();

  /*
   * Hydrate nodes from the database.
   */
  useEffect(() => {
    if (!savedNodes) return;

    const canvasNodes = savedNodes
      .map((node) => toCanvasNode(node))
      .filter((node): node is VangrexNode => node !== null);

    setNodes(canvasNodes);
  }, [savedNodes]);

  /*
   * Hydrate edges from the database.
   */
  useEffect(() => {
    if (!savedEdges) return;

    setEdges(
      savedEdges.map((edge) => ({
        id: edge.id,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        sourceHandle: edge.sourceHandle ?? undefined,
        targetHandle: edge.targetHandle ?? undefined,
      })),
    );
  }, [savedEdges]);

  /*
   * React Flow node changes.
   *
   * Position persistence happens in onNodeDragStop,
   * not on every node change.
   */
  const onNodesChange: OnNodesChange<VangrexNode> = useCallback((changes) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);

  /*
   * React Flow edge changes.
   */
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  }, []);

  /*
   * Persist node position after dragging.
   */
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: VangrexNode) => {
      updateNode.mutate({
        workflowId,
        nodeId: node.id,
        position: node.position,
      });
    },
    [updateNode, workflowId],
  );

  /*
   * Create a persisted edge.
   */
  const onConnect = useCallback(
    (connection: Connection) => {
      const id = crypto.randomUUID();

      const edge: Edge = {
        id,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
      };

      setEdges((currentEdges) => addEdge(edge, currentEdges));

      createEdge.mutate({
        workflowId,
        edge: {
          id,
          sourceNodeId: connection.source,
          targetNodeId: connection.target,
          sourceHandle: connection.sourceHandle ?? null,
          targetHandle: connection.targetHandle ?? null,
        },
      });
    },
    [createEdge, workflowId],
  );

  /*
   * Persist edge deletion.
   */
  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      for (const edge of deletedEdges) {
        deleteEdge.mutate({
          workflowId,
          edgeId: edge.id,
        });
      }
    },
    [deleteEdge, workflowId],
  );

  /*
   * Select node.
   */
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: VangrexNode) => {
      setSelectedNode(node);
    },
    [],
  );

  /*
   * Add a node.
   */
  const addNode = useCallback(
    (type: NodeType) => {
      const definition = nodeRegistry.get(type);

      const id = crypto.randomUUID();

      const position = {
        x: 250,
        y: 150,
      };

      /*
       * This assumes the node definition exposes
       * a valid defaultConfig.
       */
      const config = definition.defaultConfig;

      const newNode: VangrexNode = {
        id,
        type: "vangrex",
        position,
        data: {
          label: definition.name,
          type: definition.type,
          config,
        } as VangrexNodeData,
      };

      setNodes((currentNodes) => [...currentNodes, newNode]);

      createNode.mutate({
        workflowId,
        id,
        position,
        data: newNode.data,
      });

      setAddNodeOpen(false);
      setSelectedNode(newNode);
    },
    [createNode, workflowId],
  );

  /*
   * Update node data.
   */
  const updateNodeHandler = useCallback(
    (nodeId: string, data: Partial<VangrexNodeData>) => {
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

      updateNode.mutate({
        workflowId,
        nodeId,
        data,
      });
    },
    [updateNode, workflowId],
  );

  /*
   * Delete node.
   */
  const deleteNodeHandler = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) =>
        currentNodes.filter((node) => node.id !== nodeId),
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      deleteNode.mutate({
        workflowId,
        nodeId,
      });

      setSelectedNode(null);
    },
    [deleteNode, workflowId],
  );

  const nodeTypes = useMemo(
    () => ({
      vangrex: CanvasNode,
    }),
    [],
  );

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
      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="pointer-events-auto flex max-w-sm flex-col items-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-muted/40">
              <GitBranch className="size-5 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-medium">No nodes added yet</h3>

            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              Add your first node to start building this workflow.
            </p>

            <Button
              type="button"
              size="sm"
              className="mt-4"
              onClick={() => setAddNodeOpen(true)}
            >
              Add node
            </Button>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
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

      {selectedNode && (
        <NodeInspector
          node={selectedNode}
          onUpdate={updateNodeHandler}
          onDelete={deleteNodeHandler}
          onClose={() => setSelectedNode(null)}
        />
      )}

      <div className="absolute left-4 top-4 z-10">
        <Button
          onClick={() => setAddNodeOpen(true)}
          size="sm"
          variant="outline"
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
    </div>
  );
};

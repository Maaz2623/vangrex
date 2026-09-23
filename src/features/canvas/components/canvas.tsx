"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  OnNodeDrag,
  ReactFlow,
  type Connection,
  type Edge,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";

import { AnimatePresence, motion } from "framer-motion";

import { Check, GitBranch, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { AddNodeDialog } from "@/features/nodes/components/add-node-dialog";
import { NodeInspector } from "@/features/nodes/components/node-inspector";
import { CanvasNode } from "@/features/nodes/components/canvas-node";

import { nodeRegistry } from "@/features/nodes";
import { NodeType } from "@/features/nodes/registry";

import {
  VangrexNode,
  VangrexNodeData,
} from "@/features/nodes/types/node-data";

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
  const [selectedNode, setSelectedNode] =
    useState<VangrexNode | null>(null);

  const { data: savedNodes, isLoading: nodesLoading } =
    useNodes(workflowId);

  const { data: savedEdges, isLoading: edgesLoading } =
    useEdges(workflowId);

  const createNode = useCreateNode();
  const updateNode = useUpdateNode();
  const deleteNode = useDeleteNode();

  const createEdge = useCreateEdge();
  const deleteEdge = useDeleteEdge();

  const isLoading = nodesLoading || edgesLoading;

  const isSaving =
    createNode.isPending ||
    updateNode.isPending ||
    deleteNode.isPending ||
    createEdge.isPending ||
    deleteEdge.isPending;

  /*
   * Hydrate nodes from the database.
   */
  useEffect(() => {
    if (!savedNodes) return;

    const canvasNodes = savedNodes
      .map((node) => toCanvasNode(node))
      .filter(
        (node): node is VangrexNode => node !== null,
      );

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
  const onNodesChange: OnNodesChange<VangrexNode> = useCallback(
    (changes) => {
      setNodes((currentNodes) =>
        applyNodeChanges(changes, currentNodes),
      );
    },
    [],
  );

  /*
   * React Flow edge changes.
   */
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((currentEdges) =>
        applyEdgeChanges(changes, currentEdges),
      );
    },
    [],
  );

  /*
   * Persist node position after dragging.
   */
  const onNodeDragStop: OnNodeDrag<VangrexNode> = useCallback(
    (_event, node) => {
      updateNode.mutate({
        workflowId,
        nodeId: node.id,
        position: node.position,
      });
    },
    [updateNode, workflowId],
  );

  /*
   * Open the inspector only on double click.
   */
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: VangrexNode) => {
      setSelectedNode(node);
    },
    [],
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
        sourceHandle:
          connection.sourceHandle ?? undefined,
        targetHandle:
          connection.targetHandle ?? undefined,
      };

      setEdges((currentEdges) =>
        addEdge(edge, currentEdges),
      );

      createEdge.mutate({
        workflowId,
        edge: {
          id,
          sourceNodeId: connection.source,
          targetNodeId: connection.target,
          sourceHandle:
            connection.sourceHandle ?? null,
          targetHandle:
            connection.targetHandle ?? null,
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

      setNodes((currentNodes) => [
        ...currentNodes,
        newNode,
      ]);

      createNode.mutate({
        workflowId,
        id,
        position,
        data: newNode.data,
      });

      setAddNodeOpen(false);

      /*
       * Do not open the inspector here.
       * Inspector opens only on double click.
       */
    },
    [createNode, workflowId],
  );

  /*
   * Update node data.
   */
  const updateNodeHandler = useCallback(
    (
      nodeId: string,
      data: Partial<VangrexNodeData>,
    ) => {
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
        currentNodes.filter(
          (node) => node.id !== nodeId,
        ),
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) =>
            edge.source !== nodeId &&
            edge.target !== nodeId,
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
        stroke:
          "color-mix(in oklch, var(--muted-foreground) 45%, transparent)",
        strokeWidth: 1.5,
      },
    }),
    [],
  );

  const hasNodes = nodes.length > 0;

  return (
    <div className="relative h-[calc(100vh-5.5rem)] overflow-hidden rounded-xl border bg-background">
      {/*
       * Canvas
       */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0.35 : 1 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="absolute inset-0"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
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
      </motion.div>

      {/*
       * Loading state
       */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
            }}
            className="absolute inset-0 z-20 bg-background/70 backdrop-blur-[1px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[min(520px,calc(100%-3rem))]">
                <div className="mb-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Loading workflow...</span>
                </div>

                <div className="relative mx-auto w-full max-w-[320px]">
                  <div className="absolute -left-20 top-20 hidden h-px w-20 bg-border sm:block" />

                  <div className="absolute -right-20 top-20 hidden h-px w-20 bg-border sm:block" />

                  <CanvasSkeleton />

                  <div className="mt-10 flex justify-center">
                    <div className="h-2 w-24 animate-pulse rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
       * Empty state
       */}
      <AnimatePresence>
        {!isLoading && !hasNodes && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="pointer-events-auto flex max-w-sm flex-col items-center px-6 text-center">
              <motion.div
                initial={{
                  scale: 0.9,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  delay: 0.05,
                  duration: 0.25,
                }}
                className="mb-4 flex size-12 items-center justify-center rounded-xl border bg-muted/40"
              >
                <GitBranch className="size-5 text-muted-foreground" />
              </motion.div>

              <h3 className="text-sm font-medium">
                No nodes added yet
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                Add your first node to start building this
                workflow.
              </p>

              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4"
              >
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setAddNodeOpen(true)}
                  disabled={createNode.isPending}
                >
                  {createNode.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" />
                      Add node
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
       * Save status
       */}
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            transition={{
              duration: 0.18,
            }}
            className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-md border bg-background/95 px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur"
          >
            <Loader2 className="size-3 animate-spin" />
            Saving
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -4,
            }}
            transition={{
              duration: 0.18,
            }}
            className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-md border bg-background/95 px-2.5 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur"
          >
            <Check className="size-3" />
            Saved
          </motion.div>
        )}
      </AnimatePresence>

      {/*
       * Add node button
       */}
      <motion.div
        initial={{
          opacity: 0,
          y: -4,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
          duration: 0.25,
        }}
        className="absolute left-4 top-4 z-10"
      >
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => setAddNodeOpen(true)}
            size="sm"
            variant="outline"
            disabled={isLoading || createNode.isPending}
            className="bg-background/95 shadow-sm backdrop-blur"
          >
            {createNode.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plus className="size-3.5" />
            )}

            {createNode.isPending
              ? "Adding..."
              : "Add node"}
          </Button>
        </motion.div>
      </motion.div>

      {/*
       * Node inspector
       */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 20,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="absolute right-4 top-16 z-20"
          >
            <NodeInspector
              node={selectedNode}
              onUpdate={updateNodeHandler}
              onDelete={deleteNodeHandler}
              onClose={() => setSelectedNode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/*
       * Add node dialog
       */}
      <AddNodeDialog
        open={addNodeOpen}
        onOpenChange={setAddNodeOpen}
        onAddNode={addNode}
      />
    </div>
  );
};

function CanvasSkeleton() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.25,
      }}
      className="relative overflow-hidden rounded-xl border bg-background shadow-sm"
    >
      <div className="flex items-center gap-3 px-3.5 py-3">
        <div className="size-8 shrink-0 animate-pulse rounded-lg bg-muted" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-16 animate-pulse rounded bg-muted/70" />
        </div>
      </div>

      <div className="border-t px-3.5 py-3">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-14 animate-pulse rounded bg-muted" />
          <div className="size-2 animate-pulse rounded-full bg-muted" />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
          <div className="size-2 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </motion.div>
  );
}
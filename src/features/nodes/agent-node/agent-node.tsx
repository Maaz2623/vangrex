"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

import {
  Handle,
  NodeProps,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";

import { AgentNode } from "./agent-node.types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export const AgentNodeUI = ({ data, id }: NodeProps<AgentNode>) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const connections = useNodeConnections({
    handleType: "target",
  });

  const nodeData = useNodesData(connections?.[0]?.source);

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    if (!nodeData?.data?.value) return;

    updateNodeData(id, {
      prompt: nodeData.data.value,
    });
  }, [id, nodeData, updateNodeData]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const prompt = data.prompt ?? "";

  return (
    <>
      <div
        onDoubleClick={() => setOpen(true)}
        className="min-w-[220px] cursor-pointer rounded-xl border bg-background shadow-sm"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">AI Agent</p>

            <p className="text-xs text-muted-foreground">Autonomous workflow</p>
          </div>
        </div>

        <div className="border-t px-4 py-3">
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {prompt || "No prompt yet"}
          </p>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          id="input"
          className="!size-2.5"
        >
          Input
        </Handle>

        <Handle
          type="source"
          position={Position.Right}
          id="output"
          className="!size-2.5"
        >
          Output
        </Handle>
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>AI Agent</DrawerTitle>
              <DrawerDescription>
                Prompt received by this agent.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-6">
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {prompt || "No prompt yet"}
                </p>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Agent</DialogTitle>
            </DialogHeader>

            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm">
                {prompt || "No prompt yet"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

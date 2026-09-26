"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

import { Handle, NodeProps, Position } from "@xyflow/react";

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

export const AgentNodeUI = ({ data }: NodeProps<AgentNode>) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        className="w-[240px] cursor-pointer overflow-visible rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">AI Agent</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Autonomous workflow
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="relative h-[90px] border-y">
          <Handle
            type="target"
            position={Position.Left}
            id="input"
            className="!left-0 !size-2.5 !-translate-x-1/2"
          />

          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
            Input
          </span>

          <Handle
            type="source"
            position={Position.Right}
            id="output"
            className="!right-0 !size-2.5 !translate-x-1/2"
          />

          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
            Output
          </span>
        </div>

        {/* Footer */}
        <div className="px-4 py-3">
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Uses AI to process incoming data.
          </p>
        </div>
      </div>

      {/* Mobile */}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>
                AI Agent
              </DrawerTitle>

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
        /* Desktop */
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>
                AI Agent
              </DialogTitle>
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

"use client";

import { Bot, GitBranch, Play, Plus, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onAddNode: (type: string, label: string) => void;
}

const nodeTypes = [
  {
    type: "trigger",
    label: "Trigger",
    description: "Start a workflow",
    icon: Play,
  },
  {
    type: "action",
    label: "Action",
    description: "Perform an operation",
    icon: Zap,
  },
  {
    type: "ai",
    label: "AI",
    description: "Run an AI operation",
    icon: Bot,
  },
  {
    type: "logic",
    label: "Logic",
    description: "Control workflow flow",
    icon: GitBranch,
  },
];

export function NodePalette({ onAddNode }: Props) {
  return (
    <div className="absolute left-4 top-4 z-10 w-64 rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur">
      <div className="px-2 py-2">
        <p className="text-sm font-medium">Add node</p>
        <p className="text-xs text-muted-foreground">
          Add a step to your workflow.
        </p>
      </div>

      <div className="mt-1 space-y-1">
        {nodeTypes.map((node) => {
          const Icon = node.icon;

          return (
            <Button
              key={node.type}
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-2.5 py-2.5"
              onClick={() => onAddNode(node.type, node.label)}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                <Icon className="size-4" />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-medium">{node.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {node.description}
                </p>
              </div>

              <Plus className="size-3.5 text-muted-foreground" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

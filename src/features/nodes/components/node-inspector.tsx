"use client";

import { Trash2, X } from "lucide-react";
import type { Node } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export function NodeInspector({ node, onUpdate, onDelete, onClose }: Props) {
  const label = typeof node.data.label === "string" ? node.data.label : "";

  const type = typeof node.data.type === "string" ? node.data.type : "default";

  return (
    <div className="absolute right-4 top-4 z-10 w-72 rounded-xl border bg-background/95 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Node configuration</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            {node.id}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="node-label">Label</Label>

          <Input
            id="node-label"
            value={label}
            onChange={(event) =>
              onUpdate(node.id, {
                label: event.target.value,
              })
            }
            placeholder="Node name"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>

          <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
            {type}
          </div>
        </div>

        <div className="border-t pt-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(node.id)}
          >
            <Trash2 className="size-4" />
            Delete node
          </Button>
        </div>
      </div>
    </div>
  );
}

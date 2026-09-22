"use client";

import { Trash2 } from "lucide-react";
import type { Node } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  node: Node | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
}

export function NodeDialog({
  node,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: Props) {
  if (!node) {
    return null;
  }

  const label = typeof node.data.label === "string" ? node.data.label : "";

  const type = typeof node.data.type === "string" ? node.data.type : "default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configure node</DialogTitle>
          <DialogDescription>
            Configure this node and its execution settings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="node-label">Name</Label>

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
            <Label>Node type</Label>

            <div className="rounded-md border bg-muted/30 px-3 py-2.5 font-mono text-xs text-muted-foreground">
              {type}
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-medium">Node ID</p>

            <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">
              {node.id}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(node.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="size-4" />
            Delete node
          </Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

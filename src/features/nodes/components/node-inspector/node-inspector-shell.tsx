"use client";

import type { ReactNode } from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

import type { VangrexNode } from "@/features/nodes/types/node-data";

interface Props {
  node: VangrexNode;
  children: ReactNode;
  onClose: () => void;
  onDelete: () => void;
}

function getNodeLabel(node: VangrexNode) {
  return typeof node.data.label === "string" &&
    node.data.label.trim().length > 0
    ? node.data.label
    : "Node configuration";
}

function getNodeType(node: VangrexNode) {
  return typeof node.data.type === "string" ? node.data.type : "unknown";
}

export function NodeInspectorShell({
  node,
  children,
  onClose,
  onDelete,
}: Props) {
  const isMobile = useIsMobile();

  const label = getNodeLabel(node);
  const type = getNodeType(node);

  if (isMobile) {
    return (
      <Drawer
        open
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
      >
        <DrawerContent className="max-h-[88vh]">
          <DrawerHeader className="border-b px-4 py-4 text-left">
            <DrawerTitle className="text-sm">{label}</DrawerTitle>

            <p className="font-mono text-[10px] text-muted-foreground">
              {type}
            </p>
          </DrawerHeader>

          <div className="min-h-0 overflow-y-auto">
            <div className="space-y-5 p-4">{children}</div>
          </div>

          <InspectorFooter onDelete={onDelete} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          max-h-[85vh]
          w-[calc(100%-2rem)]
          max-w-md
          overflow-hidden
          p-0
        "
      >
        <DialogHeader className="shrink-0 border-b px-5 py-4 text-left">
          <DialogTitle className="text-sm font-medium">{label}</DialogTitle>

          <p className="font-mono text-[10px] text-muted-foreground">{type}</p>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-5 p-5">{children}</div>
        </div>

        <InspectorFooter onDelete={onDelete} />
      </DialogContent>
    </Dialog>
  );
}

function InspectorFooter({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="shrink-0 border-t bg-background p-3">
      <Button
        type="button"
        variant="destructive"
        className="w-full"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
        Delete node
      </Button>
    </div>
  );
}

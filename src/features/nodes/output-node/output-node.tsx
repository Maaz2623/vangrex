"use client";

import { useEffect, useState } from "react";

import { ArrowUp, Check, Copy } from "lucide-react";

import { Handle, Position } from "@xyflow/react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { OutputNodeData } from "./output-node.types";

export const OutputNodeUI = ({ data }: { data: OutputNodeData }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const content = data.content ?? "";
  const hasOutput = Boolean(content.trim());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (hasOutput) {
      setOpen(true);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const outputContent = (
    <div className="overflow-hidden rounded-lg border bg-muted/30">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Result
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={handleCopy}
        >
          <Copy className="size-3" />
          Copy
        </Button>
      </div>

      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words p-4 text-xs leading-6">
        <code>{content}</code>
      </pre>
    </div>
  );

  return (
    <>
      <div
        onDoubleClick={handleDoubleClick}
        className={`w-[240px] overflow-visible rounded-xl border bg-background shadow-sm transition-shadow ${
          hasOutput ? "cursor-pointer hover:shadow-md" : "cursor-default"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ArrowUp className="size-4 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Output</p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Workflow output
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="relative h-[90px] border-y">
          <Handle
            type="target"
            position={Position.Left}
            id="value"
            className="!left-0 !size-2.5 !-translate-x-1/2 !border-2 !border-background !bg-muted-foreground"
          />

          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
            Value
          </span>
        </div>

        {/* Footer */}
        <div className="px-4 py-3">
          {hasOutput ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-3 py-2">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="size-3 text-emerald-600" />
              </div>

              <span className="truncate text-xs text-muted-foreground">
                Output available
              </span>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-xs font-medium text-muted-foreground">
                No output yet
              </p>

              <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                Run the workflow to produce an output.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <ArrowUp className="size-4 text-muted-foreground" />
                </div>
                Output
              </DrawerTitle>

              <DrawerDescription>
                Result produced by the workflow.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-6">{outputContent}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        /* Desktop */
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-muted">
                  <ArrowUp className="size-4 text-muted-foreground" />
                </div>
                Output
              </DialogTitle>

              <DialogDescription>
                Result produced by the workflow.
              </DialogDescription>
            </DialogHeader>

            {outputContent}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

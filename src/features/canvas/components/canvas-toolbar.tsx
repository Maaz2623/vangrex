"use client";

import { Maximize, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CanvasToolbar() {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl border bg-background/95 p-1 shadow-lg backdrop-blur">
      <Button variant="ghost" size="sm" className="gap-2">
        <Plus className="size-4" />
        Add node
      </Button>

      <div className="h-5 w-px bg-border" />

      <Button variant="ghost" size="icon" className="size-8">
        <Maximize className="size-4" />
        <span className="sr-only">Fit canvas</span>
      </Button>
    </div>
  );
}

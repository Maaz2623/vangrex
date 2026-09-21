"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const WorkflowsHeader = () => {
  return (
    <div className="flex min-h-20 items-center justify-between gap-4 rounded-xl border bg-background px-5 py-4">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight">Workflows</h1>
        <p className="text-sm text-muted-foreground">
          Build, manage, and execute your workflows.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="relative hidden w-56 md:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search workflows..." className="h-9 pl-9" />
        </div>

        <Button variant="outline" size="icon" className="size-9">
          <SlidersHorizontal className="size-4" />
          <span className="sr-only">Filter workflows</span>
        </Button>

        <Button>
          <Plus className="size-4" />
          Create workflow
        </Button>
      </div>
    </div>
  );
};

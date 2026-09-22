"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { CreateWorkflowDialog } from "./create-workflow-dialog";

interface Props {
  search: string;
  setSearch: (search: string) => void;
}

export const WorkflowsHeader = ({ search, setSearch }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CreateWorkflowDialog open={open} setOpen={setOpen} />
      <TooltipProvider>
        <div className="flex flex-col gap-4 rounded-xl border bg-background px-4 py-4 md:flex-row sm:px-5">
          {/* Heading */}
          <div className="">
            <h1 className="text-lg font-semibold tracking-tight">Workflows</h1>

            <p className="mt-0.5 truncate md:w-full text-sm text-muted-foreground">
              Build, manage, and execute your workflows.
            </p>
          </div>

          {/* Controls */}
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* Search */}
            <div className="relative min-w-0 flex-1 sm:max-w-56">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search workflows..."
                className="h-9 w-full pl-9"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 shrink-0"
                  >
                    <SlidersHorizontal className="size-4" />

                    <span className="sr-only">Filter workflows</span>
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Filter workflows</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setOpen(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <Plus className="size-4" />
                    Create workflow
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Create a new workflow</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

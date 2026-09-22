"use client";

import { CalendarDays, Copy, ExternalLink, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

interface Props {
  workflowId: string;
}

export function WorkflowOverviewHeader({ workflowId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();

  const {
    data: workflow,
    isLoading,
    isError,
  } = useQuery(
    trpc.workflows.getWorkflow.queryOptions({
      workflowId,
    }),
  );

  if (isLoading) {
    return <WorkflowOverviewHeaderSkeleton />;
  }

  if (isError || !workflow) {
    return (
      <div className="rounded-xl border bg-background">
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <h1 className="text-sm font-medium">Workflow not found</h1>

          <p className="max-w-md text-sm text-muted-foreground">
            This workflow may have been deleted or you may not have access to
            it.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/workflows")}
          >
            Back to workflows
          </Button>
        </div>
      </div>
    );
  }

  const status = "active";

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(workflow.id);
  };

  return (
    <div className="rounded-xl border bg-background">
      <div className="flex flex-col gap-6 p-5 sm:p-6">
        {/* Top */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {workflow.name}
              </h1>

              <div className="flex shrink-0 items-center gap-1.5 rounded-full border bg-muted/40 px-2 py-0.5">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>

                <span className="text-xs font-medium text-muted-foreground">
                  {status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {workflow.description?.trim() || "No description"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/workflows/${workflowId}/canvas`)
              }
            >
              <ExternalLink className="size-4" />
              Open Canvas
            </Button>

            <Button size="sm">
              <Play className="size-4" />
              Run workflow
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">ID</span>

            <button
              type="button"
              onClick={handleCopyId}
              className="group flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-xs text-foreground transition-colors hover:bg-muted"
              title="Copy workflow ID"
            >
              <span>{workflow.id}</span>

              <Copy className="size-3 text-muted-foreground transition-colors group-hover:text-foreground" />
            </button>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">Created</span>

            <span className="text-xs font-medium">
              {new Date(workflow.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 text-muted-foreground" />

            <span className="text-xs text-muted-foreground">Updated</span>

            <span className="text-xs font-medium">
              {new Date(workflow.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowOverviewHeaderSkeleton() {
  return (
    <div className="rounded-xl border bg-background">
      <div className="flex flex-col gap-6 p-5 sm:p-6">
        {/* Top */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-56 animate-pulse rounded-md bg-muted" />

              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>

            <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-4 animate-pulse rounded bg-muted" />
            <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-3.5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          <div className="flex items-center gap-2">
            <div className="size-3.5 animate-pulse rounded bg-muted" />
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

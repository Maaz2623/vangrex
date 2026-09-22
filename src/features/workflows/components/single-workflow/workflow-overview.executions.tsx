"use client";

import { ArrowRight, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  workflowId: string;
}

const executions: {
  id: string;
  status: "success" | "failed";
  duration: string;
  startedAt: string;
}[] = [
  {
    id: "exec_8f29c1d7",
    status: "success",
    duration: "2.4s",
    startedAt: "2 minutes ago",
  },
  {
    id: "exec_72ad91e4",
    status: "success",
    duration: "1.8s",
    startedAt: "8 minutes ago",
  },
  {
    id: "exec_51bc42a9",
    status: "failed",
    duration: "4.1s",
    startedAt: "12 minutes ago",
  },
  {
    id: "exec_91ca82f3",
    status: "success",
    duration: "2.1s",
    startedAt: "18 minutes ago",
  },
  {
    id: "exec_12fd73b8",
    status: "success",
    duration: "3.0s",
    startedAt: "25 minutes ago",
  },
];

export function WorkflowOverviewExecutions({ workflowId }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [workflowId]);

  if (loading) {
    return <WorkflowOverviewExecutionsSkeleton />;
  }

  return (
    <div className="rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Recent executions</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            The latest runs of this workflow.
          </p>
        </div>

        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link href={`/dashboard/workflows/${workflowId}/executions`}>
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {/* Executions */}
      <div className="divide-y">
        {executions.map((execution) => (
          <Link
            key={execution.id}
            href={`/dashboard/workflows/${workflowId}/executions/${execution.id}`}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
          >
            {/* Status */}
            <ExecutionStatus status={execution.status} />

            {/* ID */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-xs font-medium">
                {execution.id}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {execution.startedAt}
              </p>
            </div>

            {/* Duration */}
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Clock3 className="size-3.5" />
              {execution.duration}
            </div>

            {/* Arrow */}
            <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExecutionStatus({ status }: { status: "success" | "failed" }) {
  if (status === "failed") {
    return (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-4" />
      </div>
    );
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 className="size-4" />
    </div>
  );
}

function WorkflowOverviewExecutionsSkeleton() {
  return (
    <div className="rounded-xl border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div className="space-y-1.5">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />

          <div className="h-3 w-48 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Rows */}
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 px-5 py-4">
            {/* Status */}
            <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />

            {/* ID */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />

              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>

            {/* Duration */}
            <div className="hidden h-3.5 w-10 animate-pulse rounded bg-muted sm:block" />

            {/* Arrow */}
            <div className="size-4 shrink-0 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

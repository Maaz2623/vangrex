"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Clock3, Play } from "lucide-react";

const stats = [
  {
    label: "Executions",
    value: "1,284",
    description: "Total executions",
    icon: Play,
  },
  {
    label: "Success rate",
    value: "98.7%",
    description: "Successful executions",
    icon: CheckCircle2,
  },
  {
    label: "Avg. duration",
    value: "2.4s",
    description: "Average execution time",
    icon: Clock3,
  },
  {
    label: "Last execution",
    value: "2m ago",
    description: "Most recent run",
    icon: Activity,
  },
];

interface Props {
  workflowId: string;
}

export function WorkflowOverviewStats({ workflowId }: Props) {
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
    return <WorkflowOverviewStatsSkeleton />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.label} className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>

              <div className="flex size-8 items-center justify-center rounded-lg border bg-muted/30">
                <Icon className="size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WorkflowOverviewStatsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />

            <div className="size-8 animate-pulse rounded-lg bg-muted" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-7 w-20 animate-pulse rounded bg-muted" />

            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useParams, usePathname } from "next/navigation";

import { WorkflowSidebar } from "@/features/workflows/components/workflow-sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  const { workflowId } = useParams<{
    workflowId?: string;
  }>();

  const isWorkflowPage =
    pathname.startsWith("/dashboard/workflows/") &&
    pathname !== "/dashboard/workflows" &&
    Boolean(workflowId);

  if (isWorkflowPage && workflowId) {
    return <WorkflowSidebar workflowId={workflowId} />;
  }

  return <DashboardSidebar />;
}

import { WorkflowsView } from "@/features/workflows/components/workflows-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import React from "react";

const WorkflowsPage = () => {
  prefetch(trpc.workflows.getWorkflows.queryOptions());

  return (
    <HydrateClient>
      <WorkflowsView />
    </HydrateClient>
  );
};

export default WorkflowsPage;

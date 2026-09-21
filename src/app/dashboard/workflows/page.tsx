import { WorkflowsHeader } from "@/features/workflows/components/workflows-header";
import { WorkflowsList } from "@/features/workflows/components/workflows-list";
import React from "react";

const WorkflowsPage = () => {
  return (
    <div className="pl-2.5 pt-2.5 space-y-2.5">
      <WorkflowsHeader />
      <WorkflowsList />
    </div>
  );
};

export default WorkflowsPage;

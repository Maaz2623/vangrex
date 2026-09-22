"use client";

import { motion } from "framer-motion";
import { WorkflowOverviewHeader } from "./single-workflow/workflow-overview-header";
import { WorkflowOverviewStats } from "./single-workflow/workflow-overview-stats";
import { WorkflowOverviewExecutions } from "./single-workflow/workflow-overview.executions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  workflowId: string;
}

export function WorkflowOverview({ workflowId }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="space-y-3"
    >
      <div className="w-full overflow-hidden rounded-xl">
        <ScrollArea className="h-[calc(100vh)] scrollbar-none!">
          <div className="flex flex-col gap-y-3 pb-[50vh] sm:gap-y-4">
            <WorkflowOverviewHeader workflowId={workflowId} />

            <WorkflowOverviewStats workflowId={workflowId} />

            <WorkflowOverviewExecutions workflowId={workflowId} />
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}

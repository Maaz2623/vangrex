import { WorkflowOverview } from "@/features/workflows/components/workflow-overview";

interface Props {
  params: Promise<{
    workflowId: string
  }>
}


const WorkflowIdPage = async ({params}: Props) => {

  const {workflowId} = await params

  return <WorkflowOverview workflowId={workflowId} />;
};

export default WorkflowIdPage;

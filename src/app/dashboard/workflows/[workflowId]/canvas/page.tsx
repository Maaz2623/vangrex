import { CanvasView } from "@/features/canvas/components/canvas-view";

interface Props {
  params: Promise<{
    workflowId: string;
  }>;
}

const CanvasPage = async ({ params }: Props) => {
  const { workflowId } = await params;

  return <CanvasView workflowId={workflowId} />;
};

export default CanvasPage;

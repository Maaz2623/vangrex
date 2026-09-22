import { WorkflowView } from "@/features/workflows/components/workflow-view";

export default async function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WorkflowView>{children}</WorkflowView>;
}

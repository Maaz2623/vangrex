interface Props {
  children: React.ReactNode;
}

export const WorkflowView = ({ children }: Props) => {
  return <div className="space-y-2.5 md:pl-2.5 pt-2.5">{children}</div>;
};

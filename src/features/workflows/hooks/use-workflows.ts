import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(trpc.workflows.create.mutationOptions({}));
};

export const useUpdateWorkflow = () => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateWorkflow.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.workflows.getWorkflow.queryOptions({
            workflowId: data,
          }),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getWorkflows.queryOptions(),
        );
      },
    }),
  );
};

export const useDeleteWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(trpc.workflows.deleteWorkflow.mutationOptions({}));
};

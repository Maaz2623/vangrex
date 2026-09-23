import { useTRPC } from "@/trpc/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useNodes = (workflowId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.nodes.list.queryOptions({
      workflowId,
    }),
  );
};

export const useCreateNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.nodes.create.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.nodes.list.queryOptions({
            workflowId: variables.workflowId,
          }),
        );
      },
      onError: (error) => {
        console.log(error);
      },
    }),
  );
};

export const useUpdateNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.nodes.update.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.nodes.list.queryOptions({
            workflowId: variables.workflowId,
          }),
        );
      },
    }),
  );
};

export const useDeleteNode = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.nodes.delete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.nodes.list.queryOptions({
            workflowId: variables.workflowId,
          }),
        );
      },
    }),
  );
};

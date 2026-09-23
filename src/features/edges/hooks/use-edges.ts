import { useTRPC } from "@/trpc/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEdges = (workflowId: string) => {
  const trpc = useTRPC();

  return useQuery(
    trpc.edges.list.queryOptions({
      workflowId,
    }),
  );
};

export const useCreateEdge = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.edges.create.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.edges.list.queryOptions({
            workflowId: variables.workflowId,
          }),
        );
      },
    }),
  );
};

export const useDeleteEdge = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.edges.delete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(
          trpc.edges.list.queryOptions({
            workflowId: variables.workflowId,
          }),
        );
      },
    }),
  );
};

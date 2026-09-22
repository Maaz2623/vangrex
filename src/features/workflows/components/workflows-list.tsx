"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  GitBranch,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { UpdateWorkflowDialog } from "./update-workflow-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteWorkflow } from "../hooks/use-workflows";

interface Props {
  search: string;
  setSearch: (search: string) => void;
}

export const WorkflowsList = ({ search }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();

  const { data: workflows } = useSuspenseQuery(
    trpc.workflows.getWorkflows.queryOptions(),
  );

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <ScrollArea className="h-[calc(100vh)] scrollbar-none!">
        <div className="flex flex-col gap-y-3 pb-[50vh] sm:gap-y-4">
          {workflows
            .filter((workflow) =>
              workflow.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((workflow) => (
              <WorkflowRow
                key={workflow.id}
                {...workflow}
                onClick={() =>
                  router.push(`/dashboard/workflows/${workflow.id}`)
                }
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

interface WorkflowRowProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  onClick?: () => void;
}

const WorkflowRow = ({
  id,
  name,
  description,
  createdAt,
  updatedAt,
  onClick,
}: WorkflowRowProps) => {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editWorkflowOpen, setEditWorkflowOpen] = useState(false);
  const [deleteWorkflowOpen, setDeleteWorkflowOpen] = useState(false);

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();

    await navigator.clipboard.writeText(id);

    setCopied(true);
    toast.success("Workflow ID copied to clipboard.");

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const updatedDate = new Date(updatedAt);
  const createdDate = new Date(createdAt);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <UpdateWorkflowDialog
        open={editWorkflowOpen}
        setOpen={setEditWorkflowOpen}
        defaultName={name}
        defaultDescription={description}
        workflowId={id}
      />

      <DeleteWorkflowDialog
        open={deleteWorkflowOpen}
        setOpen={setDeleteWorkflowOpen}
        workflowId={id}
        workflowName={name}
      />

      <div
        onClick={onClick}
        className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-background px-3 py-3 transition-colors hover:bg-background/60 sm:px-4 sm:py-3.5"
      >
        {/* Icon */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30 sm:size-10">
          <GitBranch className="size-4 text-muted-foreground" />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Name + ID */}
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-medium">{name}</p>

            {id && (
              <div className="hidden min-w-0 shrink-0 items-center gap-1 sm:flex">
                <span className="truncate text-xs text-muted-foreground">
                  {id}
                </span>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="size-6 shrink-0 text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}

                  <span className="sr-only">
                    {copied ? "Copied workflow ID" : "Copy workflow ID"}
                  </span>
                </Button>
              </div>
            )}
          </div>
          {/* Description */}
          {description !== null && description !== undefined ? (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:truncate">
              {description.length > 0 ? description : <i>No description</i>}
            </p>
          ) : (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:truncate">
              No description
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="hidden shrink-0 items-center gap-4 text-[11px] text-muted-foreground md:flex">
          {mounted ? (
            <>
              <span
                className="w-34 text-right"
                title={createdDate.toLocaleString()}
              >
                Created{" "}
                {formatDistanceToNow(createdDate, {
                  addSuffix: true,
                })}
              </span>

              <span
                className="w-34 text-right"
                title={updatedDate.toLocaleString()}
              >
                Updated{" "}
                {formatDistanceToNow(updatedDate, {
                  addSuffix: true,
                })}
              </span>
            </>
          ) : (
            <>
              <span className="w-34">&nbsp;</span>
              <span className="w-34">&nbsp;</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div
          className="ml-1 shrink-0 sm:ml-3"
          onClick={(event) => event.stopPropagation()}
        >
          <WorkflowDropdown
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            workflowId={id}
            onOpen={() => {
              setDropdownOpen(false);
              onClick?.();
            }}
            onEdit={() => {
              setDropdownOpen(false);
              setEditWorkflowOpen(true);
            }}
            onDelete={() => {
              setDropdownOpen(false);
              setDeleteWorkflowOpen(true);
            }}
          />
        </div>
      </div>
    </>
  );
};

interface WorkflowDropdownProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowId: string;
  onOpen?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const WorkflowDropdown = ({
  open,
  setOpen,
  workflowId,
  onOpen,
  onEdit,
  onDelete,
}: WorkflowDropdownProps) => {
  const handleCopyId = async () => {
    await navigator.clipboard.writeText(workflowId);
    toast.success("Workflow ID copied to clipboard.");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />

          <span className="sr-only">Open workflow menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenuLabel>Workflow</DropdownMenuLabel>

        <DropdownMenuItem onClick={onOpen}>
          <ExternalLink className="size-4" />
          Open workflow
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Edit workflow
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyId}>
          <Copy className="size-4" />
          Copy workflow ID
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 className="size-4" />
          Delete workflow
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DeleteWorkflowDialog = ({
  open,
  setOpen,
  workflowId,
  workflowName,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowId: string;
  workflowName: string;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteWorkflow = useDeleteWorkflow();

  const handleDelete = () => {
    deleteWorkflow.mutate(
      {
        workflowId,
      },
      {
        onSuccess: async () => {
          toast.success("Workflow deleted.");

          setOpen(false);

          await queryClient.invalidateQueries(
            trpc.workflows.getWorkflows.queryFilter(),
          );
        },
        onError: (error) => {
          toast.error(error.message || "Failed to delete workflow.");
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workflow?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{workflowName}</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteWorkflow.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            disabled={deleteWorkflow.isPending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            {deleteWorkflow.isPending ? "Deleting..." : "Delete workflow"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

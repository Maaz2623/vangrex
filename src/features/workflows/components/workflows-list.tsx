"use client";

import {
  ArrowUpDown,
  CheckCircle2,
  Clock3,
  Ellipsis,
  GitBranch,
  Loader2,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

const workflows = [
  {
    id: "wf_8x2k91",
    name: "Customer Onboarding",
    description: "Processes new customer registrations",
    status: "Active",
    execution: "Success",
    updated: "2 min ago",
  },
  {
    id: "wf_4m7p32",
    name: "GitHub Issue Processor",
    description: "Handles incoming GitHub issues",
    status: "Active",
    execution: "Running",
    updated: "18 min ago",
  },
  {
    id: "wf_9q1d45",
    name: "Content Pipeline",
    description: "Processes and publishes content",
    status: "Draft",
    execution: "Never executed",
    updated: "1 hour ago",
  },
  {
    id: "wf_2n6v18",
    name: "Data Processing",
    description: "Transforms incoming application data",
    status: "Error",
    execution: "Failed",
    updated: "3 hours ago",
  },
  {
    id: "wf_7k3p82",
    name: "Email Notification",
    description: "Sends transactional email notifications",
    status: "Active",
    execution: "Success",
    updated: "5 hours ago",
  },
  {
    id: "wf_1d9x44",
    name: "Lead Enrichment",
    description: "Enriches incoming lead information",
    status: "Active",
    execution: "Success",
    updated: "Yesterday",
  },
  {
    id: "wf_6b2m17",
    name: "Slack Notifications",
    description: "Sends workflow events to Slack",
    status: "Draft",
    execution: "Never executed",
    updated: "Yesterday",
  },
  {
    id: "wf_3q8n51",
    name: "Invoice Processing",
    description: "Processes and validates invoices",
    status: "Active",
    execution: "Running",
    updated: "2 days ago",
  },
  {
    id: "wf_5r4c29",
    name: "Webhook Handler",
    description: "Handles incoming webhook requests",
    status: "Active",
    execution: "Success",
    updated: "2 days ago",
  },
  {
    id: "wf_9t7v63",
    name: "Data Synchronization",
    description: "Synchronizes data between services",
    status: "Error",
    execution: "Failed",
    updated: "3 days ago",
  },
  {
    id: "wf_4a6k38",
    name: "User Provisioning",
    description: "Creates and configures new user accounts",
    status: "Active",
    execution: "Success",
    updated: "4 days ago",
  },
  {
    id: "wf_8m2p74",
    name: "Report Generator",
    description: "Generates scheduled application reports",
    status: "Draft",
    execution: "Never executed",
    updated: "5 days ago",
  },
  {
    id: "wf_2x5d91",
    name: "Order Processing",
    description: "Processes incoming customer orders",
    status: "Active",
    execution: "Success",
    updated: "6 days ago",
  },
  {
    id: "wf_7n4q26",
    name: "Database Backup",
    description: "Runs scheduled database backups",
    status: "Active",
    execution: "Success",
    updated: "1 week ago",
  },
  {
    id: "wf_6c8r42",
    name: "Analytics Event Processor",
    description: "Processes incoming analytics events",
    status: "Error",
    execution: "Failed",
    updated: "1 week ago",
  },
];

const executionConfig = {
  Success: {
    icon: CheckCircle2,
    className: "text-emerald-600",
  },
  Running: {
    icon: Loader2,
    className: "animate-spin text-blue-600",
  },
  Failed: {
    icon: XCircle,
    className: "text-destructive",
  },
  "Never executed": {
    icon: Clock3,
    className: "text-muted-foreground",
  },
};

interface Props {
  search: string;
  setSearch: (search: string) => void;
}

export const WorkflowsList = ({ search, setSearch }: Props) => {
  const router = useRouter();

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
  description: string;
  status?: string;
  updated?: string;
  onClick?: () => void;
}

const WorkflowRow = ({
  id,
  name,
  description,
  status,
  updated,
  onClick,
}: WorkflowRowProps) => {
  return (
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
        {/* Name */}
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium">{name}</p>

          {/* ID only on larger screens */}
          {id && (
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
              {id}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:truncate">
          {description}
        </p>

        {/* Metadata only on larger screens */}
        <div className="mt-1.5 hidden items-center gap-3 sm:flex">
          {status && (
            <span className="text-xs text-muted-foreground">{status}</span>
          )}

          {status && updated && (
            <span className="size-1 rounded-full bg-muted-foreground/40" />
          )}

          {updated && (
            <span className="text-xs text-muted-foreground">{updated}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="ml-1 shrink-0 sm:ml-3"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-8 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
        >
          <Ellipsis className="size-4" />

          <span className="sr-only">Open workflow menu</span>
        </Button>
      </div>
    </div>
  );
};

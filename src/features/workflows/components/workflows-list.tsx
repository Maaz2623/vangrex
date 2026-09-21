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

export const WorkflowsList = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl border bg-background">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search workflows..." className="h-9 pl-9" />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="size-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>All workflows</DropdownMenuItem>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem>Error</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="size-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Recently updated</DropdownMenuItem>
              <DropdownMenuItem>Name: A–Z</DropdownMenuItem>
              <DropdownMenuItem>Name: Z–A</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Oldest updated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="max-h-[calc(100vh-15rem)] overflow-auto">
        <Table className="">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow>
              <TableHead className="w-[40%]">Workflow</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last execution</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody className="">
            {workflows.map((workflow) => {
              const execution =
                executionConfig[
                  workflow.execution as keyof typeof executionConfig
                ];

              const ExecutionIcon = execution.icon;

              return (
                <TableRow key={workflow.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                        <GitBranch className="size-4 text-muted-foreground" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">
                            {workflow.name}
                          </p>

                          <Badge
                            variant={
                              workflow.status === "Error"
                                ? "destructive"
                                : workflow.status === "Active"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {workflow.status}
                          </Badge>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <ExecutionIcon
                        className={`size-4 ${execution.className}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {workflow.execution}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {workflow.execution === "Never executed"
                      ? "—"
                      : workflow.updated}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {workflow.updated}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Ellipsis className="size-4" />
                          <span className="sr-only">Open workflow menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open workflow</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

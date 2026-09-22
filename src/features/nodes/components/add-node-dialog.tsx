"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bell,
  Bot,
  Braces,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  GitBranch,
  Globe,
  Hash,
  KeyRound,
  Mail,
  MessageSquare,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  Timer,
  Upload,
  Webhook,
  X,
  Zap,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNode: (type: string, label: string) => void;
}

interface NodeType {
  type: string;
  name: string;
  icon: LucideIcon;
}

const nodeTypes: NodeType[] = [
  {
    type: "trigger",
    name: "Manual Trigger",
    icon: Play,
  },
  {
    type: "trigger",
    name: "Webhook Trigger",
    icon: Webhook,
  },
  {
    type: "trigger",
    name: "Schedule Trigger",
    icon: Calendar,
  },
  {
    type: "trigger",
    name: "Event Trigger",
    icon: Zap,
  },
  {
    type: "trigger",
    name: "Form Trigger",
    icon: Plus,
  },
  {
    type: "trigger",
    name: "Email Trigger",
    icon: Mail,
  },

  {
    type: "action",
    name: "HTTP Request",
    icon: Globe,
  },
  {
    type: "action",
    name: "Send Email",
    icon: Send,
  },
  {
    type: "action",
    name: "Send Notification",
    icon: Bell,
  },
  {
    type: "action",
    name: "Create Record",
    icon: Database,
  },
  {
    type: "action",
    name: "Update Record",
    icon: Database,
  },
  {
    type: "action",
    name: "Delete Record",
    icon: Database,
  },
  {
    type: "action",
    name: "Upload File",
    icon: Upload,
  },
  {
    type: "action",
    name: "Download File",
    icon: ArrowDown,
  },
  {
    type: "action",
    name: "Transform Data",
    icon: Braces,
  },

  {
    type: "ai",
    name: "AI Agent",
    icon: Bot,
  },
  {
    type: "ai",
    name: "AI Chat",
    icon: MessageSquare,
  },
  {
    type: "ai",
    name: "Generate Text",
    icon: Sparkles,
  },
  {
    type: "ai",
    name: "Summarize Text",
    icon: Sparkles,
  },
  {
    type: "ai",
    name: "Classify Text",
    icon: Sparkles,
  },
  {
    type: "ai",
    name: "Extract Data",
    icon: Sparkles,
  },
  {
    type: "ai",
    name: "Generate Embeddings",
    icon: Bot,
  },

  {
    type: "logic",
    name: "If / Else",
    icon: GitBranch,
  },
  {
    type: "logic",
    name: "Switch",
    icon: GitBranch,
  },
  {
    type: "logic",
    name: "Filter",
    icon: Shield,
  },
  {
    type: "logic",
    name: "Loop",
    icon: Activity,
  },
  {
    type: "logic",
    name: "For Each",
    icon: ArrowUp,
  },
  {
    type: "logic",
    name: "Delay",
    icon: Clock,
  },
  {
    type: "logic",
    name: "Wait",
    icon: Timer,
  },
  {
    type: "logic",
    name: "Retry",
    icon: Activity,
  },

  {
    type: "data",
    name: "JSON",
    icon: Braces,
  },
  {
    type: "data",
    name: "Parse JSON",
    icon: Braces,
  },
  {
    type: "data",
    name: "Format JSON",
    icon: Braces,
  },
  {
    type: "data",
    name: "CSV",
    icon: Database,
  },
  {
    type: "data",
    name: "Database Query",
    icon: Database,
  },
  {
    type: "data",
    name: "Database Insert",
    icon: Database,
  },
  {
    type: "data",
    name: "Database Update",
    icon: Database,
  },
  {
    type: "data",
    name: "Key Value",
    icon: KeyRound,
  },

  {
    type: "developer",
    name: "Run Code",
    icon: Code2,
  },
  {
    type: "developer",
    name: "JavaScript",
    icon: Code2,
  },
  {
    type: "developer",
    name: "TypeScript",
    icon: Code2,
  },
  {
    type: "developer",
    name: "Python",
    icon: Terminal,
  },
  {
    type: "developer",
    name: "Shell Command",
    icon: Terminal,
  },

  {
    type: "integration",
    name: "Slack",
    icon: MessageSquare,
  },
  {
    type: "integration",
    name: "Discord",
    icon: MessageSquare,
  },
  {
    type: "integration",
    name: "GitHub",
    icon: Code2,
  },
  {
    type: "integration",
    name: "Google Sheets",
    icon: Database,
  },
  {
    type: "integration",
    name: "Notion",
    icon: Braces,
  },
  {
    type: "integration",
    name: "Stripe",
    icon: Hash,
  },

  {
    type: "utility",
    name: "Logger",
    icon: Terminal,
  },
  {
    type: "utility",
    name: "Set Variable",
    icon: Settings,
  },
  {
    type: "utility",
    name: "Get Variable",
    icon: Settings,
  },
  {
    type: "utility",
    name: "Success",
    icon: CheckCircle2,
  },
  {
    type: "utility",
    name: "Error",
    icon: AlertCircle,
  },
];

export function AddNodeDialog({
  open,
  onOpenChange,
  onAddNode,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredNodes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return nodeTypes;
    }

    return nodeTypes.filter(
      (node) =>
        node.name.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query),
    );
  }, [search]);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);

    if (!value) {
      setSearch("");
    }
  };

  const handleAddNode = (node: NodeType) => {
    onAddNode(node.type, node.name);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>Add node</DialogTitle>
        </DialogHeader>

        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search nodes..."
              className="h-10 pl-9 pr-9"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          {filteredNodes.length > 0 ? (
            <div className="grid gap-1 sm:grid-cols-2">
              {filteredNodes.map((node) => {
                const Icon = node.icon;

                return (
                  <button
                    key={`${node.type}-${node.name}`}
                    type="button"
                    onClick={() => handleAddNode(node)}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {node.name}
                      </p>

                      <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
                        {node.type}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-3 size-5 text-muted-foreground" />

              <p className="text-sm font-medium">
                No nodes found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Try searching for a different node.
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-2.5">
          <p className="text-[11px] text-muted-foreground">
            {filteredNodes.length}{" "}
            {filteredNodes.length === 1 ? "node" : "nodes"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

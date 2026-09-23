"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Search, X } from "lucide-react";

import { nodeRegistry } from "@/features/nodes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNode: (type: string) => void;
}

export function AddNodeDialog({ open, onOpenChange, onAddNode }: Props) {
  const [search, setSearch] = useState("");

  const nodeTypes = useMemo(() => nodeRegistry.list(), []);

  const filteredNodes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return nodeTypes;
    }

    return nodeTypes.filter(
      (node) =>
        node.name.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query) ||
        node.category.toLowerCase().includes(query),
    );
  }, [nodeTypes, search]);

  const handleOpenChange = (value: boolean) => {
    onOpenChange(value);

    if (!value) {
      setSearch("");
    }
  };

  const handleAddNode = (type: string) => {
    onAddNode(type);
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
                    key={node.type}
                    type="button"
                    onClick={() => handleAddNode(node.type)}
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
                        {node.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-3 size-5 text-muted-foreground" />

              <p className="text-sm font-medium">No nodes found</p>

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

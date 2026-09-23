"use client";

import { Trash2, X } from "lucide-react";
import type { Node } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import { nodeRegistry } from "@/features/nodes";
import { NodeType } from "../registry";

interface Props {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

export function NodeInspector({ node, onUpdate, onDelete, onClose }: Props) {
  const label = typeof node.data.label === "string" ? node.data.label : "";

  const type = typeof node.data.type === "string" ? node.data.type : "";

  const nodeType = type as NodeType;

  const definition = nodeRegistry.has(nodeType)
    ? nodeRegistry.get(nodeType)
    : null;

  const config =
    node.data.config &&
    typeof node.data.config === "object" &&
    !Array.isArray(node.data.config)
      ? (node.data.config as Record<string, unknown>)
      : {};

  const updateLabel = (value: string) => {
    onUpdate(node.id, {
      label: value,
    });
  };

  const updateConfig = (key: string, value: unknown) => {
    onUpdate(node.id, {
      config: {
        ...config,
        [key]: value,
      },
    });
  };

  return (
    <div className="absolute right-4 top-4 z-10 flex w-80 flex-col overflow-hidden rounded-xl border bg-background/95 shadow-lg backdrop-blur">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Node configuration</p>

          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
            {node.id}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={onClose}
        >
          <X className="size-4" />

          <span className="sr-only">Close inspector</span>
        </Button>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="max-h-[calc(100vh-120px)]">
        <div className="space-y-5 p-4">
          {/* Node information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`node-label-${node.id}`}>Label</Label>

              <Input
                id={`node-label-${node.id}`}
                value={label}
                onChange={(event) => updateLabel(event.target.value)}
                placeholder="Node name"
              />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>

              <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs text-muted-foreground">
                {type || "Unknown"}
              </div>
            </div>
          </div>

          {/* Configuration */}
          {definition?.configFields && definition.configFields.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <p className="text-sm font-medium">Configuration</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Configure this node&apos;s behavior.
                </p>
              </div>

              <div className="space-y-4">
                {definition.configFields.map((field) => {
                  const value = config[field.key];

                  switch (field.type) {
                    case "textarea":
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`config-${node.id}-${field.key}`}>
                            {field.label}
                          </Label>

                          <Textarea
                            id={`config-${node.id}-${field.key}`}
                            value={typeof value === "string" ? value : ""}
                            onChange={(event) =>
                              updateConfig(field.key, event.target.value)
                            }
                            placeholder={field.placeholder}
                          />

                          {field.description && (
                            <p className="text-[11px] leading-4 text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );

                    case "number":
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`config-${node.id}-${field.key}`}>
                            {field.label}
                          </Label>

                          <Input
                            id={`config-${node.id}-${field.key}`}
                            type="number"
                            value={typeof value === "number" ? value : ""}
                            onChange={(event) => {
                              const rawValue = event.target.value;

                              updateConfig(
                                field.key,
                                rawValue === "" ? undefined : Number(rawValue),
                              );
                            }}
                            placeholder={field.placeholder}
                          />

                          {field.description && (
                            <p className="text-[11px] leading-4 text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );

                    case "select":
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label>{field.label}</Label>

                          <Select
                            value={
                              typeof value === "string" ? value : undefined
                            }
                            onValueChange={(value) =>
                              updateConfig(field.key, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  field.placeholder ??
                                  `Select ${field.label.toLowerCase()}`
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {field.description && (
                            <p className="text-[11px] leading-4 text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );

                    case "switch":
                      return (
                        <div
                          key={field.key}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0 space-y-1">
                            <Label>{field.label}</Label>

                            {field.description && (
                              <p className="text-[11px] leading-4 text-muted-foreground">
                                {field.description}
                              </p>
                            )}
                          </div>

                          <Switch
                            checked={value === true}
                            onCheckedChange={(checked) =>
                              updateConfig(field.key, checked)
                            }
                          />
                        </div>
                      );

                    case "text":
                    default:
                      return (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`config-${node.id}-${field.key}`}>
                            {field.label}
                          </Label>

                          <Input
                            id={`config-${node.id}-${field.key}`}
                            value={typeof value === "string" ? value : ""}
                            onChange={(event) =>
                              updateConfig(field.key, event.target.value)
                            }
                            placeholder={field.placeholder}
                          />

                          {field.description && (
                            <p className="text-[11px] leading-4 text-muted-foreground">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          )}

          {/* No configuration */}
          {definition &&
            (!definition.configFields ||
              definition.configFields.length === 0) && (
              <div className="border-t pt-4">
                <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    This node has no configuration options.
                  </p>
                </div>
              </div>
            )}

          {/* Unknown node */}
          {!definition && (
            <div className="border-t pt-4">
              <div className="rounded-lg border border-dashed bg-muted/20 px-3 py-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Node definition not found.
                </p>
              </div>
            </div>
          )}

          {/* Delete */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={() => onDelete(node.id)}
            >
              <Trash2 className="size-4" />
              Delete node
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

"use client";

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

import type { VangrexNode } from "@/features/nodes/types/node-data";

interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "switch";
  placeholder?: string;
  description?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

interface Props {
  node: VangrexNode;
  fields: ConfigField[];
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function InspectorFields({ node, fields, onUpdate }: Props) {
  const config =
    node.data.config &&
    typeof node.data.config === "object" &&
    !Array.isArray(node.data.config)
      ? (node.data.config as Record<string, unknown>)
      : {};

  const updateConfig = (key: string, value: unknown) => {
    onUpdate(node.id, {
      config: {
        ...config,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => {
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
                  value={typeof value === "string" ? value : undefined}
                  onValueChange={(nextValue) =>
                    updateConfig(field.key, nextValue)
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
                      <SelectItem key={option.value} value={option.value}>
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
  );
}

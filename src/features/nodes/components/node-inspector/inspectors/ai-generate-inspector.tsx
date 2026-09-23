"use client";

import { useState } from "react";

import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Slider } from "@/components/ui/slider";

import { Textarea } from "@/components/ui/textarea";

import type { NodeInspectorContentProps } from "../types";

const MODELS = [
  {
    label: "GPT-5.6",
    value: "gpt-5.6",
  },
  {
    label: "GPT-5.6 Mini",
    value: "gpt-5.6-mini",
  },
];

export function GenerateInspector({
  node,
  onUpdate,
}: NodeInspectorContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const config =
    node.data.config &&
    typeof node.data.config === "object" &&
    !Array.isArray(node.data.config)
      ? (node.data.config as Record<string, unknown>)
      : {};

  const model = typeof config.model === "string" ? config.model : "gpt-5.6";

  const temperature =
    typeof config.temperature === "number" ? config.temperature : 0.7;

  const systemPrompt =
    typeof config.systemPrompt === "string"
      ? config.systemPrompt
      : "You are an assistant";

  const updateConfig = (updates: Record<string, unknown>) => {
    onUpdate(node.id, {
      ...node.data,
      config: {
        ...config,
        ...updates,
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Configuration */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Configuration</h3>

            <p className="text-xs text-muted-foreground">
              Configure how the AI generates its response.
            </p>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between gap-4 px-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">Model</p>

                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {model}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                <Settings2 className="size-4" />
                Configure
              </Button>
            </div>

            <div className="border-t" />

            <div className="grid grid-cols-2 divide-x">
              <div className="px-3 py-3">
                <p className="text-xs text-muted-foreground">Temperature</p>

                <p className="mt-1 font-mono text-sm">
                  {temperature.toFixed(2)}
                </p>
              </div>

              <div className="px-3 py-3">
                <p className="text-xs text-muted-foreground">System prompt</p>

                <p className="mt-1 truncate text-sm">{systemPrompt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connections */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">Connections</h3>

            <p className="text-xs text-muted-foreground">
              Inputs and outputs available on this node.
            </p>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Prompt</p>

                <p className="font-mono text-[10px] text-muted-foreground">
                  prompt
                </p>
              </div>

              <span className="rounded-md border bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                input
              </span>
            </div>

            <div className="border-t" />

            <div className="flex items-center justify-between px-3 py-2.5">
              <div>
                <p className="text-sm font-medium">Message</p>

                <p className="font-mono text-[10px] text-muted-foreground">
                  message
                </p>
              </div>

              <span className="rounded-md border bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                output
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Generate configuration dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate configuration</DialogTitle>

            <DialogDescription>
              Configure the model and generation behavior for this node.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Model */}
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Model</p>

                <p className="text-xs text-muted-foreground">
                  Select the model used to generate the response.
                </p>
              </div>

              <Select
                value={model}
                onValueChange={(value) =>
                  updateConfig({
                    model: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>

                <SelectContent>
                  {MODELS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Temperature</p>

                  <p className="text-xs text-muted-foreground">
                    Controls randomness of generated output.
                  </p>
                </div>

                <span className="rounded-md border bg-muted px-2 py-1 font-mono text-xs">
                  {temperature.toFixed(2)}
                </span>
              </div>

              <Slider
                value={[temperature]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={([value]) => {
                  if (value === undefined) return;

                  updateConfig({
                    temperature: value,
                  });
                }}
              />

              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            {/* System prompt */}
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">System prompt</p>

                <p className="text-xs text-muted-foreground">
                  Instructions that define how the model should behave.
                </p>
              </div>

              <Textarea
                value={systemPrompt}
                onChange={(event) =>
                  updateConfig({
                    systemPrompt: event.target.value,
                  })
                }
                placeholder="You are an assistant..."
                className="min-h-32 resize-y text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

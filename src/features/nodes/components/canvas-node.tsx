import { Handle, Position, type NodeProps } from "@xyflow/react";

import { nodeRegistry, type NodeType } from "../registry";

export const CanvasNode = ({ data, selected }: NodeProps) => {
  const nodeType = data.type as NodeType;
  const definition = nodeRegistry.get(nodeType);

  const Icon = definition.icon;

  const inputs = definition.inputs ?? [];
  const outputs = definition.outputs ?? [];

  const portCount = Math.max(inputs.length, outputs.length, 1);

  return (
    <div
      className={[
        "relative min-w-[220px] pb-6 overflow-visible rounded-xl border bg-background shadow-sm transition-shadow",
        selected ? "border-foreground/30 shadow-md" : "border-border",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{definition.name}</p>

          <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
            {definition.category}
          </p>
        </div>
      </div>

      {/* Ports */}
      {(inputs.length > 0 || outputs.length > 0) && (
        <div
          className="relative border-t"
          style={{
            height: `${portCount * 28 + 12}px`,
          }}
        >
          {/* Inputs */}
          {inputs.map((input, index) => (
            <div
              key={`input-${input.id}`}
              className="absolute left-0 flex items-center"
              style={{
                top: `${18 + index * 28}px`,
              }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                className="!relative !left-0 !top-0 !size-2 !-translate-x-1/2 !transform-none !border-2 !border-background !bg-muted-foreground"
              />

              <span className="ml-2 whitespace-nowrap text-[11px] text-muted-foreground">
                {input.name}
              </span>
            </div>
          ))}

          {/* Outputs */}
          {outputs.map((output, index) => (
            <div
              key={`output-${output.id}`}
              className="absolute right-0 flex items-center"
              style={{
                top: `${18 + index * 28}px`,
              }}
            >
              <span className="mr-2 whitespace-nowrap text-[11px] text-muted-foreground">
                {output.name}
              </span>

              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                className="!relative !right-0 !top-0 !size-2 !translate-x-1/2 !transform-none !border-2 !border-background !bg-muted-foreground"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

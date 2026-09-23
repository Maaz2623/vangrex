import type { LucideIcon } from "lucide-react";
import type { ZodType } from "zod";

import {
  defineNode as defineSdkNode,
  type NodeDefinition,
} from "@vangrex/node-sdk";

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "switch";
  description?: string;
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
}

export interface VangrexNodeDefinition<
  TInput extends ZodType = ZodType,
  TOutput extends ZodType = ZodType,
  TConfig extends ZodType = ZodType,
> extends NodeDefinition<TInput, TOutput> {
  category: string;
  icon: LucideIcon;
  config: TConfig;
  configFields?: ConfigField[];
}

export function defineNode<
  TInput extends ZodType,
  TOutput extends ZodType,
  TConfig extends ZodType,
>(
  definition: VangrexNodeDefinition<TInput, TOutput, TConfig>,
): VangrexNodeDefinition<TInput, TOutput, TConfig> {
  return defineSdkNode(definition) as VangrexNodeDefinition<
    TInput,
    TOutput,
    TConfig
  >;
}

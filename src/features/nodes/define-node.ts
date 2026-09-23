import type { LucideIcon } from "lucide-react";
import type { ZodType } from "zod";

import {
  defineNode as defineSdkNode,
  type NodeDefinition,
} from "@vangrex/node-sdk";

export interface VangrexNodeDefinition<
  TInput extends ZodType = ZodType,
  TOutput extends ZodType = ZodType,
> extends NodeDefinition<TInput, TOutput> {
  category: string;
  icon: LucideIcon;
}

export function defineNode<
  TInput extends ZodType,
  TOutput extends ZodType,
>(
  definition: VangrexNodeDefinition<TInput, TOutput>,
): VangrexNodeDefinition<TInput, TOutput> {
  return defineSdkNode(definition) as VangrexNodeDefinition<
    TInput,
    TOutput
  >;
}
import { NodeDefinition } from "@vangrex/node-sdk";
import { LucideIcon } from "lucide-react";


export interface VangrexNodeDefinition extends NodeDefinition<any, any> {
    category: string;
    icon: LucideIcon
}
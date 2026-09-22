"use client";

import Link from "next/link";

import {
  ActivityIcon,
  ArrowLeft,
  KeyRoundIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";

import { motion, type Transition } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavMain } from "@/features/dashboard/components/nav-main";
import { Button } from "@/components/ui/button";

const motionTransition: Transition = {
  duration: 0.22,
  ease: "easeOut",
};

interface Props {
  workflowId: string;
}

export function WorkflowSidebar({ workflowId }: Props) {
  const workflowNav = [
    {
      title: "Overview",
      href: `/dashboard/workflows/${workflowId}`,
      icon: LayoutDashboardIcon,
    },
    {
      title: "Canvas",
      href: `/dashboard/workflows/${workflowId}/canvas`,
      icon: WorkflowIcon,
    },
    {
      title: "Executions",
      href: `/dashboard/workflows/${workflowId}/executions`,
      icon: ActivityIcon,
    },
    {
      title: "API Keys",
      href: `/dashboard/workflows/${workflowId}/api-keys`,
      icon: KeyRoundIcon,
    },
    {
      title: "Settings",
      href: `/dashboard/workflows/${workflowId}/settings`,
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="top-18 ml-3 mt-1 h-[calc(100vh-5.5rem)] rounded-xl border"
    >
      <SidebarRail />

      <SidebarHeader>
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={motionTransition}
        >
          <Button asChild variant={`outline`} className="w-full flex justify-start">
            <Link
              href="/dashboard/workflows"
              className="flex h-10 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="size-4 shrink-0" />
              <span>Back to Workflows</span>
            </Link>
          </Button>
        </motion.div>
      </SidebarHeader>

      <SidebarContent>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...motionTransition,
            delay: 0.04,
          }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Workflow</SidebarGroupLabel>

            <NavMain items={workflowNav} />
          </SidebarGroup>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}

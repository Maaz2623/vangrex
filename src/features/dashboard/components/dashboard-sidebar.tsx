"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  BookOpenIcon,
  Code2Icon,
  HistoryIcon,
  SettingsIcon,
  WebhookIcon,
  WorkflowIcon,
} from "lucide-react";

import { motion } from "framer-motion";

import { NavMain } from "./nav-main";
import { authClient } from "@/lib/auth-client";
import { NavUser, NavUserSkeleton } from "./nav-user";

export function DashboardSidebar() {
  const { data } = authClient.useSession();

  const workspaceNav = [
    {
      title: "Workflows",
      href: "/dashboard/workflows",
      icon: WorkflowIcon,
    },
    {
      title: "Executions",
      href: "/dashboard/executions",
      icon: HistoryIcon,
    },
  ];

  const developerNav = [
    {
      title: "API",
      href: "/dashboard/api",
      icon: Code2Icon,
    },
    {
      title: "Webhooks",
      href: "/dashboard/webhooks",
      icon: WebhookIcon,
    },
  ];

  const resourcesNav = [
    {
      title: "Documentation",
      href: "/docs",
      icon: BookOpenIcon,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="top-18 ml-3 mt-1 h-[calc(100vh-5.5rem)] rounded-xl border"
    >
      <SidebarRail />

      <SidebarHeader />

      <SidebarContent>
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <NavMain items={workspaceNav} />
          </SidebarGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            delay: 0.04,
          }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Developer</SidebarGroupLabel>
            <NavMain items={developerNav} />
          </SidebarGroup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            delay: 0.08,
          }}
        >
          <SidebarGroup>
            <SidebarGroupLabel>Resources</SidebarGroupLabel>
            <NavMain items={resourcesNav} />
          </SidebarGroup>
        </motion.div>
      </SidebarContent>

      <SidebarFooter>
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            delay: 0.12,
          }}
        >
          <NavMain
            items={[
              {
                title: "Settings",
                href: "/dashboard/settings",
                icon: SettingsIcon,
              },
            ]}
          />

          {data?.user ? (
            <NavUser user={data.user} />
          ) : (
            <NavUserSkeleton />
          )}
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  );
}
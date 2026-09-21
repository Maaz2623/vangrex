"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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

import { NavMain } from "./nav-main";
import { authClient } from "@/lib/auth-client";
import { NavUser, NavUserSkeleton } from "./nav-user";

export function AppSidebar() {
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
      className="top-18 ml-3 h-[calc(100vh-5.5rem)] border rounded-xl overflow-visible! mt-1 "
    >
      <SidebarRail />

      <SidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <NavMain items={workspaceNav} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Developer</SidebarGroupLabel>
          <NavMain items={developerNav} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <NavMain items={resourcesNav} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavMain
          items={[
            {
              title: "Settings",
              href: "/dashboard/settings",
              icon: SettingsIcon,
            },
          ]}
        />

        {data?.user ? <NavUser user={data.user} /> : <NavUserSkeleton />}
      </SidebarFooter>
    </Sidebar>
  );
}

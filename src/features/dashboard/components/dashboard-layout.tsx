import React from "react";

import { DashboardHeader } from "./dashboard-header";
import { AppSidebar } from "./app-sidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-dvh flex-col p-3 overflow-hidden">
      {/* Fixed header */}

      {/* Remaining viewport height */}
      <DashboardHeader />
      <SidebarProvider className="min-h-0 flex-1 ">
        <AppSidebar />

        <main className="min-w-0 flex-1 overflow-hidden">{children}</main>
      </SidebarProvider>
    </div>
  );
};

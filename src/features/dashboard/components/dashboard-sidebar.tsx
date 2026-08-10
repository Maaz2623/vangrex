import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Roboto_Mono } from "next/font/google";

export const DashboardSidebar = () => {
  return (
    <Sidebar className="">
      <SidebarHeader className="">
        <div
          className={cn(
            "text-xl font-semibold flex items-center tracking-wider",
          )}
        >
          <Logo width={45} height={45} />
          <h2>Vangrex</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

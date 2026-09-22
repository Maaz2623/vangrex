"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = {
  title: string;
  href: string;
  icon?: LucideIcon;
};

export function NavMain({ items }: { items: Item[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const href = item.href;

        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              isActive={active}
              className="h-10"
              tooltip={item.title}
            >
              <Link href={href}>
                {item.icon && <item.icon className="size-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

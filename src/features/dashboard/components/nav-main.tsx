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
  exact?: boolean;
};

export function NavMain({ items }: { items: Item[] }) {
  const pathname = usePathname();

  const activeHref = items
    .filter((item) => {
      if (item.exact) {
        return pathname === item.href;
      }

      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    })
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = item.href === activeHref;

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={active}
              className="h-10"
              tooltip={item.title}
            >
              <Link href={item.href}>
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

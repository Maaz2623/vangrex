"use client";

import { useState } from "react";
import Link from "next/link";

import { Bell, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";
import { AppSidebarMobile } from "./app-sidebar-mobile";

export const DashboardHeader = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <AppSidebarMobile
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
      />

      <header className="flex h-14 w-full shrink-0 items-center rounded-xl border bg-background px-4 lg:px-6">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 size-8 md:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="size-4" />
          <span className="sr-only">Open navigation</span>
        </Button>

        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center font-semibold tracking-tight"
        >
          <Logo height={30} width={30} />
          <span>Vangrex</span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          {/* Search */}
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 text-muted-foreground sm:flex"
          >
            <Search className="size-4" />
            <span>Search</span>
            <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              ⌘ K
            </kbd>
          </Button>

          <Separator orientation="vertical" className="mx-2 h-5" />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="size-8">
            <Bell className="size-4" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </header>
    </>
  );
};

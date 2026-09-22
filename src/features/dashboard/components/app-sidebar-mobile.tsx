"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BadgeCheck,
  Bell,
  BookOpenIcon,
  ChevronsUpDown,
  Code2Icon,
  CreditCard,
  HistoryIcon,
  LogOut,
  SettingsIcon,
  Sparkles,
  WebhookIcon,
  WorkflowIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";
import { AuthUser } from "@/features/auth/types/auth.types";

interface AppSidebarMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type NavItem = {
  title: string;
  href: string;
  icon: typeof WorkflowIcon;
};

export function AppSidebarMobile({
  open,
  onOpenChange,
}: AppSidebarMobileProps) {
  const { data } = authClient.useSession();

  const workspaceNav: NavItem[] = [
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

  const developerNav: NavItem[] = [
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

  const resourcesNav: NavItem[] = [
    {
      title: "Documentation",
      href: "/docs",
      icon: BookOpenIcon,
    },
  ];

  const settingsNav: NavItem[] = [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px] gap-0 p-0 sm:w-[300px]"
      >
        {/* Header */}
        <SheetHeader className="h-14 border-b px-4">
          <SheetTitle asChild>
            <Link
              href="/dashboard"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <Logo height={30} width={30} />
              <span>Vangrex</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-3">
          <MobileNavSection
            label="Workspace"
            items={workspaceNav}
            onNavigate={() => onOpenChange(false)}
          />

          <MobileNavSection
            label="Developer"
            items={developerNav}
            onNavigate={() => onOpenChange(false)}
          />

          <MobileNavSection
            label="Resources"
            items={resourcesNav}
            onNavigate={() => onOpenChange(false)}
          />
        </div>

        {/* Footer */}
        <div className="border-t p-2">
          <MobileNavSection
            label={undefined}
            items={settingsNav}
            onNavigate={() => onOpenChange(false)}
          />

          <div className="mt-1">
            {data?.user ? (
              <MobileNavUser user={data.user} />
            ) : (
              <MobileNavUserSkeleton />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavSection({
  label,
  items,
  onNavigate,
}: {
  label?: string;
  items: NavItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="mb-4">
      {label && (
        <div className="mb-1 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}

      <nav className="space-y-1">
        {items.map((item) => (
          <MobileNavItem
            key={item.href}
            item={item}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </div>
  );
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={[
        "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground",
      ].join(" ")}
    >
      <Icon className="size-4 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );
}

function MobileNavUser({ user }: { user: AuthUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-start gap-3 px-2 py-2"
        >
          <Avatar className="h-8 w-8 shrink-0 rounded-lg">
            <AvatarImage
              src={user.image || "/logo.svg"}
              alt={user.name}
            />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user.name}
            </span>

            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>

          <ChevronsUpDown className="ml-auto size-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[250px] rounded-lg"
        side="top"
        align="end"
        sideOffset={6}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={user.image || "/logo.svg"}
                alt={user.name}
              />

              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/*
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>

          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        */}

        <DropdownMenuItem>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavUserSkeleton() {
  return (
    <div className="flex h-12 items-center gap-3 px-2">
      <Skeleton className="h-8 w-8 rounded-full" />

      <div className="grid flex-1 gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>

      <ChevronsUpDown className="size-4 opacity-40" />
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

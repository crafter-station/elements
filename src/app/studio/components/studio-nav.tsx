"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hammer,
  Compass,
  Sparkles,
  FolderOpen,
  Box,
} from "lucide-react";

import { UserButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/studio",
    exact: true,
  },
  {
    label: "Builder",
    icon: Hammer,
    href: "/studio/builder",
  },
  {
    label: "Explore",
    icon: Compass,
    href: "/studio/explore",
  },
  {
    label: "Generate",
    icon: Sparkles,
    href: "/studio/generate",
  },
  {
    label: "My Registries",
    icon: FolderOpen,
    href: "/studio/my-registries",
  },
];

function StudioSidebarContent() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary">
            <Box className="size-3.5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-pixel text-sm tracking-wider uppercase">
              Registry Studio
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => {
                const isActive = route.exact
                  ? pathname === route.href
                  : pathname.startsWith(route.href);

                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={route.label}
                      className={
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                          : ""
                      }
                    >
                      <Link href={route.href}>
                        <route.icon className="size-4" />
                        <span>{route.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-1 py-1">
          <UserButton
            afterSignOutUrl="/studio"
            appearance={{
              elements: {
                avatarBox: "size-7",
              },
            }}
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/50">
                tryelements.dev
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </>
  );
}

export function StudioNav() {
  return (
    <>
      <Sidebar collapsible="icon">
        <StudioSidebarContent />
      </Sidebar>
      <div className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-border/50 bg-background px-4 md:hidden">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded bg-foreground">
            <Box className="size-2.5 text-background" />
          </div>
          <span className="font-pixel text-xs tracking-wider uppercase">
            Registry Studio
          </span>
        </div>
      </div>
    </>
  );
}

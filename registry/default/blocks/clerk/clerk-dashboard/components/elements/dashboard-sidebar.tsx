"use client";

import type * as React from "react";

import { useUser } from "@clerk/nextjs";
import { Activity, FolderKanban, Settings, Users } from "lucide-react";

import { useRole } from "../../lib/use-role";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { AppLogo } from "./app-logo";
import { type NavItem, NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  /**
   * Custom logo component to display in the sidebar header
   */
  logo?: React.ReactNode;
  /**
   * Custom navigation items. If not provided, defaults will be used.
   * The default navigation includes role-based sub-items.
   */
  navItems?: NavItem[];
  /**
   * Titles of navigation items that should only be visible to admins
   */
  adminOnlyItems?: string[];
  /**
   * URL for the settings page
   */
  settingsUrl?: string;
  /**
   * Whether to show the search button in the header
   */
  showSearch?: boolean;
  /**
   * Callback when search button is clicked
   */
  onSearchClick?: () => void;
  /**
   * Custom labels for UI elements
   */
  labels?: {
    settings?: string;
    signOut?: string;
    dashboard?: string;
    allItems?: string;
    myItems?: string;
    projects?: string;
    allProjects?: string;
    myProjects?: string;
    members?: string;
  };
}

export function DashboardSidebar({
  logo,
  navItems,
  adminOnlyItems = ["Members"],
  settingsUrl = "/settings",
  showSearch = true,
  onSearchClick,
  labels = {},
  ...props
}: DashboardSidebarProps) {
  const { user } = useUser();
  const { isAdmin } = useRole();

  const mergedLabels = {
    settings: "Settings",
    signOut: "Sign out",
    dashboard: "Dashboard",
    allItems: "All items",
    myItems: "My items",
    projects: "Projects",
    allProjects: "All projects",
    myProjects: "My projects",
    members: "Members",
    ...labels,
  };

  // Default navigation with role-based sub-items (similar to Croma)
  const defaultNavItems: NavItem[] = [
    {
      title: mergedLabels.dashboard,
      url: "/dashboard",
      icon: Activity,
      isActive: true,
      items: [
        isAdmin && {
          title: mergedLabels.allItems,
          url: "/dashboard",
        },
        user?.id && {
          title: mergedLabels.myItems,
          url: `/dashboard?assignee=${user.id}`,
        },
      ].filter(Boolean) as { title: string; url: string }[],
    },
    {
      title: mergedLabels.projects,
      url: "/projects",
      icon: FolderKanban,
      isActive: true,
      items: [
        isAdmin && {
          title: mergedLabels.allProjects,
          url: "/projects",
        },
        user?.id && {
          title: mergedLabels.myProjects,
          url: `/projects?assignee=${user.id}`,
        },
      ].filter(Boolean) as { title: string; url: string }[],
    },
    isAdmin && {
      title: mergedLabels.members,
      url: "/members",
      icon: Users,
    },
    {
      title: mergedLabels.settings,
      url: settingsUrl,
      icon: Settings,
    },
  ].filter(Boolean) as NavItem[];

  const items = navItems ?? defaultNavItems;

  // Filter nav items based on admin status
  const filteredNavItems = items.filter((item) => {
    if (adminOnlyItems.includes(item.title)) {
      return isAdmin;
    }
    return true;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppLogo
          logo={logo}
          showSearch={showSearch}
          onSearchClick={onSearchClick}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          settingsUrl={settingsUrl}
          labels={{
            settings: mergedLabels.settings,
            signOut: mergedLabels.signOut,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

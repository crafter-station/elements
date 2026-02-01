"use client";

import type * as React from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { NavItem } from "./nav-main";

interface ClerkDashboardProps {
  /**
   * Custom logo component to display in the sidebar header
   */
  logo?: React.ReactNode;
  /**
   * Custom navigation items. If not provided, defaults will be used.
   */
  navItems?: NavItem[];
  /**
   * Titles of navigation items that should only be visible to admins
   */
  adminOnlyItems?: string[];
  /**
   * URL for the settings page in the user dropdown
   */
  settingsUrl?: string;
  /**
   * Custom labels for UI elements
   */
  labels?: {
    settings?: string;
    signOut?: string;
  };
  /**
   * Content for the unauthenticated state
   */
  unauthenticatedContent?: React.ReactNode;
  /**
   * The main content of the dashboard
   */
  children?: React.ReactNode;
}

function DefaultUnauthenticatedContent() {
  return (
    <div
      data-slot="clerk-dashboard-unauthenticated"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Please sign in to continue</h1>
        <p className="text-muted-foreground">
          You need to be authenticated to access this page.
        </p>
      </div>
    </div>
  );
}

export function ClerkDashboard({
  logo,
  navItems,
  adminOnlyItems,
  settingsUrl,
  labels,
  unauthenticatedContent,
  children,
}: ClerkDashboardProps) {
  return (
    <>
      <SignedOut>
        {unauthenticatedContent ?? <DefaultUnauthenticatedContent />}
      </SignedOut>
      <SignedIn>
        <SidebarProvider>
          <DashboardSidebar
            logo={logo}
            navItems={navItems}
            adminOnlyItems={adminOnlyItems}
            settingsUrl={settingsUrl}
            labels={labels}
          />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </SignedIn>
    </>
  );
}

export { getRoleLabel, ORG_ROLES, type OrgRole } from "../../lib/constants";
export { useRole } from "../../lib/use-role";
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
export { AccountInfo } from "./account-info";
export { AppLogo } from "./app-logo";
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./dashboard-breadcrumb";
// Re-export all components for easy access
export { DashboardSidebar } from "./dashboard-sidebar";
export { EmptyState } from "./empty-state";
export { InvitationsTable } from "./invitations-table";
export { InviteDialog } from "./invite-dialog";
export { MembersTable } from "./members-table";
export { type NavItem, NavMain } from "./nav-main";
export { NavUser } from "./nav-user";
export { OrganizationBadge } from "./organization-badge";
export { PageHeader } from "./page-header";
export { RemoveMemberDialog } from "./remove-member-dialog";
export { RevokeInvitationDialog } from "./revoke-invitation-dialog";

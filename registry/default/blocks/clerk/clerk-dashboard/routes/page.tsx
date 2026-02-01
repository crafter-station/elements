"use client";

import { Building2, LayoutDashboard, Settings, Users } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AccountInfo,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  ClerkDashboard,
  InvitationsTable,
  InviteDialog,
  MembersTable,
  type NavItem,
  OrganizationBadge,
  PageHeader,
  useRole,
} from "../components/elements/clerk-dashboard";
import { SidebarTrigger } from "../components/ui/sidebar";

// Example custom logo component
function Logo() {
  return (
    <div className="flex h-8 items-center gap-2 px-2">
      <Building2 className="h-5 w-5" />
      <span className="font-semibold">Acme Inc</span>
    </div>
  );
}

// Example navigation configuration with sub-items
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard" },
      { title: "Analytics", url: "/dashboard/analytics" },
    ],
  },
  {
    title: "Members",
    url: "/members",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function DashboardPage() {
  const { isAdmin } = useRole();

  return (
    <ClerkDashboard
      logo={<Logo />}
      navItems={navItems}
      adminOnlyItems={["Members"]}
      settingsUrl="/settings"
    >
      {/* Header with breadcrumb navigation */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Organization</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <OrganizationBadge />
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 pt-6">
        {/* Page header with gradient icon */}
        <PageHeader
          icon={Users}
          title="Organization Members"
          description="Manage your organization members and invitations"
          action={isAdmin ? <InviteDialog /> : undefined}
        />

        {/* Tabs for different sections */}
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="account">
              Account
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger className="cursor-pointer" value="members">
                Members
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger className="cursor-pointer" value="invitations">
                Invitations
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="account" className="mt-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                View your account details and organization membership.
              </p>
            </div>
            <AccountInfo />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="members" className="mt-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Organization Members</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage the members of your organization.
                </p>
              </div>
              <MembersTable />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="invitations" className="mt-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Pending Invitations</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage pending invitations to your organization.
                </p>
              </div>
              <InvitationsTable />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </ClerkDashboard>
  );
}

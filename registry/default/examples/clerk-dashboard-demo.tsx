"use client";

import Link from "next/link";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import {
  Activity,
  Building2,
  ChevronRight,
  ChevronUp,
  FolderKanban,
  LogIn,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/registry/default/blocks/clerk/clerk-dashboard/components/ui/sidebar";

// Navigation items with sub-items
const navItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Activity,
    isActive: true,
    items: [
      { title: "All items", url: "#" },
      { title: "My items", url: "#" },
    ],
  },
  {
    title: "Projects",
    url: "#",
    icon: FolderKanban,
    isActive: true,
    items: [
      { title: "All projects", url: "#" },
      { title: "My projects", url: "#" },
    ],
  },
  {
    title: "Members",
    url: "#",
    icon: Users,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function DemoLogo() {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <span className="font-semibold">Demo App</span>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}

function DemoNavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => {
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className="cursor-pointer"
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="cursor-pointer"
              >
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function LiveNavUser() {
  const { user } = useUser();

  if (!user) return null;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-pointer">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.imageUrl} alt={user.fullName ?? ""} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user.fullName || "User"}
            </span>
            <span className="truncate text-xs">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
          <ChevronUp className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function LiveAccountInfo() {
  const { user } = useUser();
  const { organization, membership } = useOrganization();

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-48 font-medium">Full name</TableCell>
              <TableCell>{user.fullName || "Not specified"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Primary email</TableCell>
              <TableCell>
                {user.primaryEmailAddress?.emailAddress || "Not specified"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Username</TableCell>
              <TableCell>{user.username || "Not specified"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">User ID</TableCell>
              <TableCell className="font-mono text-sm">{user.id}</TableCell>
            </TableRow>
            {organization && (
              <>
                <TableRow>
                  <TableCell className="font-medium">Organization</TableCell>
                  <TableCell>{organization.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Role</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {membership?.role === "org:admin" ? "Admin" : "Member"}
                    </Badge>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LiveOrganizationBadge() {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Building2 className="h-3 w-3" />
      <span className="text-xs">{organization?.name || "Personal"}</span>
    </div>
  );
}

function DemoBreadcrumb() {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        <li className="hidden md:inline-flex items-center gap-1.5">
          <span className="transition-colors hover:text-foreground cursor-pointer">
            Dashboard
          </span>
        </li>
        <li
          role="presentation"
          aria-hidden="true"
          className="hidden md:block [&>svg]:size-3.5"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="font-normal text-foreground">Account</span>
        </li>
      </ol>
    </nav>
  );
}

function DemoPageHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-3 shadow-inner">
          <Users className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Your Account</h1>
        <p className="text-sm text-muted-foreground">
          Live data from Clerk authentication
        </p>
      </div>
      <SignOutButton>
        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
}

function SignedInDashboard() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <DemoLogo />
        </SidebarHeader>
        <SidebarContent>
          <DemoNavMain />
        </SidebarContent>
        <SidebarFooter>
          <LiveNavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DemoBreadcrumb />
          </div>
          <LiveOrganizationBadge />
        </header>

        <main className="flex-1 flex flex-col gap-6 p-4 pt-6">
          <DemoPageHeader />

          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="account">
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  Your real account details from Clerk.
                </p>
              </div>
              <LiveAccountInfo />
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Live Demo!</strong> This shows your real Clerk account
                  data. All components are fully functional.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SignInPrompt() {
  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-background to-muted/30">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shadow-lg">
          <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-4 shadow-inner">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Try the Live Demo</h2>
          <p className="text-muted-foreground">
            Sign in to experience the dashboard with real Clerk authentication.
            See your actual account data in action!
          </p>
        </div>

        <SignInButton mode="modal">
          <Button size="lg" className="gap-2 cursor-pointer">
            <LogIn className="h-4 w-4" />
            Sign in to try demo
          </Button>
        </SignInButton>

        <p className="text-xs text-muted-foreground">
          Powered by Clerk. No setup required - just sign in!
        </p>
      </div>
    </div>
  );
}

export default function ClerkDashboardDemo() {
  return (
    <div className="h-[650px] w-full overflow-hidden rounded-lg border bg-background">
      <SignedOut>
        <SignInPrompt />
      </SignedOut>
      <SignedIn>
        <SignedInDashboard />
      </SignedIn>
    </div>
  );
}

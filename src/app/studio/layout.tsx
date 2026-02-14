import type { Metadata } from "next";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { StudioNav } from "./components/studio-nav";

export const metadata: Metadata = {
  title: "Registry Studio - Component Registry Builder",
  description:
    "Build, explore, and manage component registries with AI assistance.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <StudioNav />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

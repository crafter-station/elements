import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { ProviderSidebar } from "@/components/provider-sidebar";

export default function ProvidersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex pt-[55px]">
        {/* Left Sidebar */}
        <ProviderSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 md:ml-54 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

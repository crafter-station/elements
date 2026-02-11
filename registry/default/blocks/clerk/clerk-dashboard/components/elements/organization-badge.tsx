"use client";

import { useOrganization } from "@clerk/nextjs";
import { Building2 } from "lucide-react";

export function OrganizationBadge() {
  const { organization, isLoaded } = useOrganization();

  if (!organization || !isLoaded) return null;

  return (
    <div
      data-slot="organization-badge"
      className="mr-2 flex items-center gap-1.5 text-muted-foreground"
    >
      <Building2 className="h-3 w-3" />
      <span className="max-w-[120px] truncate text-xs">
        {organization.name}
      </span>
    </div>
  );
}

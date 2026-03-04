"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const AVATAR_COLORS = [
  "bg-violet-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface ClerkOrgSwitcherProps {
  className?: string;
  showPersonalAccount?: boolean;
}

export function ClerkOrgSwitcher({
  className,
  showPersonalAccount = true,
}: ClerkOrgSwitcherProps) {
  const {
    isLoaded: isOrgListLoaded,
    userMemberships,
    setActive,
  } = useOrganizationList({ userMemberships: true });
  const { isLoaded: isOrgLoaded, organization } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelectOrg = useCallback(
    (orgId: string) => {
      setOpen(false);
      setActive?.({ organization: orgId });
    },
    [setActive],
  );

  const handleSelectPersonal = useCallback(() => {
    setOpen(false);
    setActive?.({ organization: null });
  }, [setActive]);

  if (!isOrgListLoaded || !isOrgLoaded || !isUserLoaded) {
    return (
      <div
        data-slot="clerk-org-switcher"
        className={cn("relative inline-block text-sm", className)}
      >
        <div className="flex min-w-[220px] items-center gap-3 rounded-lg border border-border bg-card px-3 py-2">
          <span className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-muted" />
          <span className="h-4 flex-1 animate-pulse rounded bg-muted" />
          <span className="h-4 w-4 shrink-0 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  const organizations =
    userMemberships.data?.map((m) => ({
      id: m.organization.id,
      name: m.organization.name,
      imageUrl: m.organization.imageUrl,
      role: m.role,
    })) ?? [];

  const isPersonal = organization === null;
  const activeOrg = organizations.find((o) => o.id === organization?.id);

  return (
    <div
      ref={containerRef}
      data-slot="clerk-org-switcher"
      className={cn("relative inline-block text-sm", className)}
    >
      <button
        data-slot="trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full min-w-[220px] items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors",
          "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-accent",
        )}
      >
        {isPersonal ? (
          <span
            data-slot="personal-avatar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted"
          >
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
        ) : activeOrg ? (
          activeOrg.imageUrl ? (
            <img
              src={activeOrg.imageUrl}
              alt={activeOrg.name}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              data-slot="org-avatar"
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                getAvatarColor(activeOrg.id),
              )}
            >
              {getInitials(activeOrg.name)}
            </span>
          )
        ) : null}

        <span
          data-slot="active-label"
          className="flex-1 truncate font-medium text-foreground"
        >
          {isPersonal ? "Personal account" : activeOrg?.name}
        </span>

        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        data-slot="dropdown"
        className={cn(
          "absolute left-0 z-50 mt-1 w-full origin-top rounded-lg border border-border bg-popover p-1 shadow-lg transition-all duration-150",
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        {showPersonalAccount && (
          <>
            <button
              data-slot="personal-option"
              type="button"
              onClick={handleSelectPersonal}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                "hover:bg-accent",
                isPersonal && "bg-accent",
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </span>

              <div
                data-slot="personal-info"
                className="flex flex-1 flex-col truncate"
              >
                <span className="truncate text-sm font-medium text-foreground">
                  Personal account
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>

              {isPersonal && (
                <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
              )}
            </button>

            <div data-slot="divider" className="my-1 h-px bg-border" />
          </>
        )}

        <div data-slot="org-list" className="flex flex-col">
          {organizations.map((org) => {
            const isActive = org.id === organization?.id;

            return (
              <button
                key={org.id}
                data-slot="org-option"
                type="button"
                onClick={() => handleSelectOrg(org.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                  "hover:bg-accent",
                  isActive && "bg-accent",
                )}
              >
                {org.imageUrl ? (
                  <img
                    src={org.imageUrl}
                    alt={org.name}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                      getAvatarColor(org.id),
                    )}
                  >
                    {getInitials(org.name)}
                  </span>
                )}

                <div className="flex flex-1 items-center gap-2 truncate">
                  <span className="truncate text-sm font-medium text-foreground">
                    {org.name}
                  </span>
                  {org.role && (
                    <span
                      data-slot="role-badge"
                      className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {org.role}
                    </span>
                  )}
                </div>

                {isActive && (
                  <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>

        <div data-slot="divider" className="my-1 h-px bg-border" />

        <button
          data-slot="create-org"
          type="button"
          onClick={() => setOpen(false)}
          className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-border">
            <PlusIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium">Create organization</span>
        </button>
      </div>
    </div>
  );
}

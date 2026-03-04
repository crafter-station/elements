"use client";

import * as React from "react";

import { useClerk, useUser } from "@clerk/nextjs";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

interface MenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface ClerkUserButtonProps {
  className?: string;
  menuItems?: MenuItem[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ClerkUserButton({
  className,
  menuItems,
}: ClerkUserButtonProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!isLoaded) {
    return (
      <div
        data-slot="clerk-user-button"
        className={cn("relative inline-block", className)}
      >
        <div className="size-8 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  const name = user?.fullName || "User";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const imageUrl = user?.imageUrl;
  const initials = isSignedIn ? getInitials(name) : "?";

  const defaultItems: MenuItem[] = [
    {
      label: "Profile",
      icon: <UserIcon className="size-4" />,
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="size-4" />,
    },
  ];

  const resolvedItems = menuItems ?? defaultItems;

  return (
    <div
      data-slot="clerk-user-button"
      ref={containerRef}
      className={cn("relative inline-block", className)}
    >
      <button
        data-slot="clerk-user-button-trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {imageUrl ? (
          <img
            data-slot="clerk-user-button-avatar"
            src={imageUrl}
            alt={name}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span
            data-slot="clerk-user-button-avatar"
            className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
          >
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          data-slot="clerk-user-button-menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div
            data-slot="clerk-user-button-menu-header"
            className="border-b border-border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {initials}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div data-slot="clerk-user-button-menu-items" className="py-1">
            {resolvedItems.map((item) => (
              <button
                key={item.label}
                data-slot="clerk-user-button-menu-item"
                type="button"
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                {item.icon && (
                  <span className="text-muted-foreground">{item.icon}</span>
                )}
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-border py-1">
            <button
              data-slot="clerk-user-button-sign-out"
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <span className="text-muted-foreground">
                <LogOutIcon className="size-4" />
              </span>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

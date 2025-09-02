"use client";

import Link from "next/link";

import { SignInButton, useClerk, useUser } from "@clerk/nextjs";

import { ElementsLogo } from "@/components/elements-logo";
import { PixelatedHeartIcon } from "@/components/pixelated-heart-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="w-full border-border border-dotted border-b-1">
      <div className="flex items-center justify-between max-w-screen-xl px-4 sm:px-8 mx-auto border-border border-dotted border-r-1 border-l-1">
        <Link className="flex space-x-2 py-4 sm:py-5 items-center" href="/">
          <ElementsLogo className="size-6" />
          <h1 className="text-lg sm:text-xl font-semibold">Elements</h1>
          <span className="items-center justify-center border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground hidden sm:inline-flex rounded-full text-xs">
            tryelements.dev
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-md gap-2 text-sm sm:text-base"
          >
            <Link href="/sponsor">
              <PixelatedHeartIcon className="size-4" />
              <span className="hidden sm:inline">Sponsor</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-md gap-0 text-sm sm:text-base"
          >
            <Link
              href="https://github.com/crafter-station/elements"
              target="_blank"
              rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>GitHub Logo</title>
                <path
                  fill="currentColor"
                  d="M5 2h4v2H7v2H5V2Zm0 10H3V6h2v6Zm2 2H5v-2h2v2Zm2 2v-2H7v2H3v-2H1v2h2v2h4v4h2v-4h2v-2H9Zm0 0v2H7v-2h2Zm6-12v2H9V4h6Zm4 2h-2V4h-2V2h4v4Zm0 6V6h2v6h-2Zm-2 2v-2h2v2h-2Zm-2 2v-2h2v2h-2Zm0 2h-2v-2h2v2Zm0 0h2v4h-2v-4Z"
                />{" "}
              </svg>
              <span className="hidden sm:inline ml-2">
                crafter-station/elements
              </span>
            </Link>
          </Button>

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.firstName || "User"}
                  />
                  <AvatarFallback>
                    {user?.firstName?.[0] ||
                      user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user?.fullName ||
                      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                      "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress || "No email"}
                  </p>
                </div>
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <SignInButton mode="modal">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}

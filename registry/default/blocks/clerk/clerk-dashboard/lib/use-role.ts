"use client";

import { useOrganization } from "@clerk/nextjs";

import { ORG_ROLES } from "./constants";

/**
 * Hook to get the current user's role in the organization
 * @returns Object containing the role string and isAdmin boolean
 */
export function useRole() {
  const { membership } = useOrganization();

  const role = membership?.role;
  const isAdmin = role === ORG_ROLES.ADMIN;

  return {
    role,
    isAdmin,
  };
}

/**
 * Clerk organization role constants
 * These are the standard Clerk organization roles
 */
export const ORG_ROLES = {
  ADMIN: "org:admin",
  MEMBER: "org:member",
} as const;

export type OrgRole = (typeof ORG_ROLES)[keyof typeof ORG_ROLES];

/**
 * Get a human-readable label for an organization role
 * @param role - The Clerk organization role
 * @param labels - Custom labels for roles (optional)
 * @returns Human-readable role label
 */
export function getRoleLabel(
  role: string | undefined | null,
  labels?: { admin?: string; member?: string },
): string {
  const defaultLabels = {
    admin: "Admin",
    member: "Member",
  };
  const mergedLabels = { ...defaultLabels, ...labels };

  if (role === ORG_ROLES.ADMIN) return mergedLabels.admin;
  if (role === ORG_ROLES.MEMBER) return mergedLabels.member;
  return "Unknown";
}

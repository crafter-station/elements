"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { format } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { getRoleLabel } from "../../lib/constants";

interface AccountInfoProps {
  labels?: {
    fullName?: string;
    email?: string;
    username?: string;
    userId?: string;
    createdAt?: string;
    organization?: string;
    role?: string;
    notSpecified?: string;
    notAvailable?: string;
  };
  roleLabels?: {
    admin?: string;
    member?: string;
  };
}

function AccountInfoSkeleton() {
  return (
    <div data-slot="account-info-skeleton" className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <TableRow key={i}>
                <TableCell className="w-48">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function AccountInfo({ labels = {}, roleLabels }: AccountInfoProps) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, membership, isLoaded: isOrgLoaded } = useOrganization();

  const mergedLabels = {
    fullName: "Full name",
    email: "Primary email",
    username: "Username",
    userId: "User ID",
    createdAt: "Created at",
    organization: "Organization",
    role: "Role",
    notSpecified: "Not specified",
    notAvailable: "Not available",
    ...labels,
  };

  if (!isUserLoaded || !isOrgLoaded) {
    return <AccountInfoSkeleton />;
  }

  if (!user) return null;

  return (
    <div data-slot="account-info" className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="w-48 font-medium">
                {mergedLabels.fullName}
              </TableCell>
              <TableCell>
                {user.fullName || mergedLabels.notSpecified}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                {mergedLabels.email}
              </TableCell>
              <TableCell>
                {user.primaryEmailAddress?.emailAddress ||
                  mergedLabels.notSpecified}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                {mergedLabels.username}
              </TableCell>
              <TableCell>
                {user.username || mergedLabels.notSpecified}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                {mergedLabels.userId}
              </TableCell>
              <TableCell className="font-mono text-sm">{user.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                {mergedLabels.createdAt}
              </TableCell>
              <TableCell>
                {user.createdAt
                  ? format(new Date(user.createdAt), "PPP")
                  : mergedLabels.notAvailable}
              </TableCell>
            </TableRow>
            {organization && (
              <>
                <TableRow>
                  <TableCell className="font-medium">
                    {mergedLabels.organization}
                  </TableCell>
                  <TableCell>{organization.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {mergedLabels.role}
                  </TableCell>
                  <TableCell>
                    {getRoleLabel(membership?.role, roleLabels)}
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

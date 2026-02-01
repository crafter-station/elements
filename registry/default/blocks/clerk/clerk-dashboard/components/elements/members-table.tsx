"use client";

import { useState } from "react";

import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";
import { format } from "date-fns";
import { Mail, MoreHorizontal, UserMinus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getRoleLabel } from "../../lib/constants";
import { useRole } from "../../lib/use-role";
import { RemoveMemberDialog } from "./remove-member-dialog";

interface MembersTableProps {
  labels?: {
    name?: string;
    email?: string;
    role?: string;
    joinDate?: string;
    actions?: string;
    openMenu?: string;
    removeFromTeam?: string;
    removing?: string;
    memberRemoved?: string;
    removeError?: string;
    noMembers?: string;
  };
  roleLabels?: {
    admin?: string;
    member?: string;
  };
}

function MembersTableLoading() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function MembersTable({ labels = {}, roleLabels }: MembersTableProps) {
  const { isAdmin } = useRole();
  const { memberships, isLoaded } = useOrganization({
    memberships: { infinite: true },
  });

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] =
    useState<OrganizationMembershipResource | null>(null);

  const mergedLabels = {
    name: "Name",
    email: "Email",
    role: "Role",
    joinDate: "Join date",
    actions: "Actions",
    openMenu: "Open menu",
    removeFromTeam: "Remove from team",
    removing: "Removing...",
    memberRemoved: "Member removed successfully",
    removeError: "Error removing member",
    noMembers: "No members found",
    ...labels,
  };

  const isLoading = !isLoaded || !memberships?.data;
  const hasMembers = memberships?.data && memberships.data.length > 0;

  const handleRemoveMember = async () => {
    if (!memberToRemove || !memberships?.data) return;

    try {
      setRemovingId(memberToRemove.id);
      await memberToRemove.destroy();
      await memberships?.revalidate?.();
      toast.success(mergedLabels.memberRemoved);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(mergedLabels.removeError);
    } finally {
      setRemovingId(null);
      setMemberToRemove(null);
    }
  };

  return (
    <div data-slot="members-table" className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{mergedLabels.name}</TableHead>
              <TableHead>{mergedLabels.email}</TableHead>
              <TableHead>{mergedLabels.role}</TableHead>
              <TableHead>{mergedLabels.joinDate}</TableHead>
              <TableHead className="text-right">
                {mergedLabels.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <MembersTableLoading />
            ) : hasMembers ? (
              memberships.data.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell className="font-medium">
                    <span>
                      {membership.publicUserData?.firstName}{" "}
                      {membership.publicUserData?.lastName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm">
                        {membership.publicUserData?.identifier ?? "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getRoleLabel(membership.role, roleLabels)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(membership.createdAt), "PPP")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            disabled={removingId === membership.id}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">
                              {mergedLabels.openMenu}
                            </span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>
                            {mergedLabels.actions}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMemberToRemove(membership);
                            }}
                            disabled={removingId === membership.id}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            {removingId === membership.id
                              ? mergedLabels.removing
                              : mergedLabels.removeFromTeam}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  {mergedLabels.noMembers}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RemoveMemberDialog
        member={memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}

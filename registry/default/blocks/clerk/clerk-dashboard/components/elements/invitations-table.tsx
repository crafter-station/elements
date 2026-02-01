"use client";

import { useState } from "react";

import { useOrganization } from "@clerk/nextjs";
import type { OrganizationInvitationResource } from "@clerk/types";
import { format } from "date-fns";
import { Mail, MoreHorizontal, XCircle } from "lucide-react";
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
import { RevokeInvitationDialog } from "./revoke-invitation-dialog";

interface InvitationsTableProps {
  labels?: {
    email?: string;
    role?: string;
    sentDate?: string;
    actions?: string;
    openMenu?: string;
    revokeInvitation?: string;
    invitationRevoked?: string;
    revokeError?: string;
    noInvitations?: string;
  };
  roleLabels?: {
    admin?: string;
    member?: string;
  };
}

function InvitationsTableLoading() {
  return (
    <>
      {[1, 2].map((i) => (
        <TableRow key={i}>
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

export function InvitationsTable({
  labels = {},
  roleLabels,
}: InvitationsTableProps) {
  const { invitations, isLoaded } = useOrganization({
    invitations: { infinite: true },
  });

  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [invitationToRevoke, setInvitationToRevoke] =
    useState<OrganizationInvitationResource | null>(null);

  const mergedLabels = {
    email: "Email",
    role: "Role",
    sentDate: "Sent date",
    actions: "Actions",
    openMenu: "Open menu",
    revokeInvitation: "Revoke invitation",
    invitationRevoked: "Invitation revoked successfully",
    revokeError: "Error revoking invitation",
    noInvitations: "No pending invitations",
    ...labels,
  };

  const isLoading = !isLoaded || !invitations?.data;
  const hasInvitations = invitations?.data && invitations.data.length > 0;

  const handleRevokeInvitation = async () => {
    if (!invitationToRevoke) return;

    try {
      setRevokingId(invitationToRevoke.id);
      await invitationToRevoke.revoke();
      await invitations?.revalidate?.();
      toast.success(mergedLabels.invitationRevoked);
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast.error(mergedLabels.revokeError);
    } finally {
      setRevokingId(null);
      setInvitationToRevoke(null);
    }
  };

  return (
    <div data-slot="invitations-table" className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{mergedLabels.email}</TableHead>
              <TableHead>{mergedLabels.role}</TableHead>
              <TableHead>{mergedLabels.sentDate}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <InvitationsTableLoading />
            ) : hasInvitations ? (
              invitations.data.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm">{invitation.emailAddress}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getRoleLabel(invitation.role, roleLabels)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(new Date(invitation.createdAt), "PPP")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          disabled={revokingId === invitation.id}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="sr-only">
                            {mergedLabels.openMenu}
                          </span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {mergedLabels.actions}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvitationToRevoke(invitation);
                          }}
                          disabled={revokingId === invitation.id}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {mergedLabels.revokeInvitation}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  {mergedLabels.noInvitations}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RevokeInvitationDialog
        invitation={invitationToRevoke}
        onOpenChange={(open) => !open && setInvitationToRevoke(null)}
        onConfirm={handleRevokeInvitation}
      />
    </div>
  );
}

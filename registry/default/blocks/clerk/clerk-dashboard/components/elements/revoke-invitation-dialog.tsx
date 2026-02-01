"use client";

import type { OrganizationInvitationResource } from "@clerk/types";
import { XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RevokeInvitationDialogProps {
  invitation: OrganizationInvitationResource | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  labels?: {
    title?: string;
    description?: string;
    cancel?: string;
    confirm?: string;
  };
}

export function RevokeInvitationDialog({
  invitation,
  onOpenChange,
  onConfirm,
  labels = {},
}: RevokeInvitationDialogProps) {
  const mergedLabels = {
    title: "Revoke invitation?",
    description:
      "This action will revoke the invitation sent to {email}. They will not be able to join the organization with this invitation.",
    cancel: "Cancel",
    confirm: "Revoke invitation",
    ...labels,
  };

  const email = invitation?.emailAddress ?? "";
  const description = mergedLabels.description.replace("{email}", email);

  return (
    <AlertDialog open={!!invitation} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{mergedLabels.title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{mergedLabels.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="cursor-pointer">
            <XCircle className="h-4 w-4" />
            {mergedLabels.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

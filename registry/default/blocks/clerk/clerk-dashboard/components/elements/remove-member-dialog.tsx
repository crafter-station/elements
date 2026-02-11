"use client";

import type { OrganizationMembershipResource } from "@clerk/types";
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

interface RemoveMemberDialogProps {
  member: OrganizationMembershipResource | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  labels?: {
    title?: string;
    description?: string;
    cancel?: string;
    confirm?: string;
  };
}

export function RemoveMemberDialog({
  member,
  onOpenChange,
  onConfirm,
  labels = {},
}: RemoveMemberDialogProps) {
  const mergedLabels = {
    title: "Remove member?",
    description:
      "This action will remove {name} ({email}) from the organization. The member will lose access to all organization resources.",
    cancel: "Cancel",
    confirm: "Remove from team",
    ...labels,
  };

  const memberName =
    `${member?.publicUserData?.firstName ?? ""} ${member?.publicUserData?.lastName ?? ""}`.trim();
  const memberEmail = member?.publicUserData?.identifier ?? "";

  const description = mergedLabels.description
    .replace("{name}", memberName)
    .replace("{email}", memberEmail);

  return (
    <AlertDialog open={!!member} onOpenChange={onOpenChange}>
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

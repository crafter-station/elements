"use client";

import * as React from "react";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, UserPlus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ORG_ROLES } from "../../lib/constants";
import { useRole } from "../../lib/use-role";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum([ORG_ROLES.ADMIN, ORG_ROLES.MEMBER]),
});

interface InviteDialogProps {
  labels?: {
    trigger?: string;
    title?: string;
    description?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    roleLabel?: string;
    rolePlaceholder?: string;
    roleAdmin?: string;
    roleMember?: string;
    cancel?: string;
    submit?: string;
    submitting?: string;
    success?: string;
    error?: string;
  };
}

export function InviteDialog({ labels = {} }: InviteDialogProps) {
  const { isAdmin } = useRole();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { organization, invitations } = useOrganization({
    invitations: { infinite: true },
  });

  const mergedLabels = {
    trigger: "Invite new member",
    title: "Invite new member",
    description:
      "Enter the email address of the person you want to invite to the organization. We will send them an invitation email.",
    emailLabel: "Email address",
    emailPlaceholder: "example@email.com",
    roleLabel: "Role",
    rolePlaceholder: "Select a role",
    roleAdmin: "Admin",
    roleMember: "Member",
    cancel: "Cancel",
    submit: "Send invitation",
    submitting: "Sending...",
    success: "Invitation sent successfully",
    error: "Error sending invitation. Please try again.",
    ...labels,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!isAdmin) return null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organization) return;

    try {
      setIsLoading(true);
      await organization.inviteMember({
        emailAddress: values.email,
        role: values.role,
      });
      await invitations?.revalidate?.();

      form.reset();
      setOpen(false);
      toast.success(mergedLabels.success);
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error(mergedLabels.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <UserPlus className="h-4 w-4" />
          {mergedLabels.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mergedLabels.title}</DialogTitle>
          <DialogDescription>{mergedLabels.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mergedLabels.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={mergedLabels.emailPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{mergedLabels.roleLabel}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={mergedLabels.rolePlaceholder}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ORG_ROLES.MEMBER}>
                        {mergedLabels.roleMember}
                      </SelectItem>
                      <SelectItem value={ORG_ROLES.ADMIN}>
                        {mergedLabels.roleAdmin}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
                {mergedLabels.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {isLoading ? mergedLabels.submitting : mergedLabels.submit}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

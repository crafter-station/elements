"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import { CheckCircleIcon, LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold">Access Denied</h1>
              <p className="text-muted-foreground text-sm">
                Please sign in to access the dashboard
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.firstName || "User"}
                  />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    Welcome, {user.firstName || user.username || "User"}!
                  </CardTitle>
                  <CardDescription>
                    You successfully signed in with Clerk
                  </CardDescription>
                </div>
              </div>
              <SignOutButton>
                <Button variant="outline" size="sm">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </CardHeader>
        </Card>

        {/* Success Message */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-400">
                  Authentication Successful
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your Clerk authentication components are working correctly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Information retrieved from Clerk</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Name:</span>
                <p>
                  {user.fullName ||
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Username:
                </span>
                <p>{user.username || "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Email:
                </span>
                <p>
                  {user.primaryEmailAddress?.emailAddress || "Not provided"}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Phone:
                </span>
                <p>{user.primaryPhoneNumber?.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  User ID:
                </span>
                <p className="font-mono text-xs">{user.id}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Created:
                </span>
                <p>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Ready to customize your authentication flow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  Customize the sign-in and sign-up components to match your
                  design
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  Update the redirect URLs in your components to point to your
                  actual dashboard
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>
                  Add additional authentication features like organization
                  management
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                <p>Configure your Clerk webhooks for user management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

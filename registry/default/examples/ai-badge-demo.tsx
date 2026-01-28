"use client";

import { AIBadge } from "@/registry/default/blocks/badges/ai-badge/components/elements/ai-badge";

export default function AIBadgeDemo() {
  return (
    <div className="flex items-center justify-center p-8 w-full max-w-md mx-auto">
      <AIBadge
        profilePictureUrl="https://media.licdn.com/dms/image/v2/D5603AQGU2q4kBtBmGw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1715891891554?e=1771459200&v=beta&t=3V708eaMMC0V2Mho5Q7Epg9dyfrhpJwqpog5oOfOszA"
        badgeNumber="#001"
        firstName="Guillermo"
        lastName="Rauch"
        jobTitle="CEO at Vercel"
        branding={{
          title: "100 DAYS",
          subtitle: "OF SHIPPING",
        }}
      />
    </div>
  );
}

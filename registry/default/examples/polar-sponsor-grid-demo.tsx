"use client";

import { PolarSponsorGrid } from "@/registry/default/blocks/polar/polar-sponsor-grid/components/elements/polar-sponsor-grid";

const DEMO_SPONSORS = [
  { id: "1", name: "Vercel", avatarUrl: "https://github.com/vercel.png", amount: 500, profileUrl: "https://vercel.com" },
  { id: "2", name: "Supabase", avatarUrl: "https://github.com/supabase.png", amount: 250, profileUrl: "https://supabase.com" },
  { id: "3", name: "Prisma", avatarUrl: "https://github.com/prisma.png", amount: 100, profileUrl: "https://prisma.io" },
  { id: "4", name: "Clerk", avatarUrl: "https://github.com/clerk.png", amount: 100, profileUrl: "https://clerk.com" },
  { id: "5", name: "Neon", avatarUrl: "https://github.com/neondatabase.png", amount: 75, profileUrl: "https://neon.tech" },
  { id: "6", name: "Resend", avatarUrl: "https://github.com/resend.png", amount: 50, profileUrl: "https://resend.com" },
  { id: "7", name: "Upstash", avatarUrl: "https://github.com/upstash.png", amount: 50, profileUrl: "https://upstash.com" },
  { id: "8", name: "Alice Smith", amount: 25 },
  { id: "9", name: "Bob Johnson", amount: 25 },
  { id: "10", name: "Carol Williams", amount: 10 },
  { id: "11", name: "David Brown", amount: 10 },
  { id: "12", name: "Eva Martinez", amount: 5 },
  { id: "13", name: "Frank Lee", amount: 5 },
  { id: "14", name: "Grace Kim", amount: 5 },
];

export default function PolarSponsorGridDemo() {
  return (
    <div className="max-w-2xl">
      <PolarSponsorGrid sponsors={DEMO_SPONSORS} showTierLabels />
    </div>
  );
}

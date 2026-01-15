import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elements Studio - Tailwind Rapid Prototyping",
  description:
    "Type Tailwind classes, see instant preview. The fastest way to prototype UI.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}

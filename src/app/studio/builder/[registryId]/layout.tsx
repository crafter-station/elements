import type * as React from "react";

export default function RegistryEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto">{children}</div>;
}

"use client";

import { useEffect, useState } from "react";

import { ComponentInstallDock } from "./install-dock";

interface ComponentInstallDockWrapperProps {
  componentName: string;
  category: string;
  providerName: string;
}

export function ComponentInstallDockWrapper({
  componentName,
  category,
  providerName,
}: ComponentInstallDockWrapperProps) {
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(
    new Set([componentName]),
  );

  // Reset selection when component changes
  useEffect(() => {
    setSelectedComponents(new Set([componentName]));
  }, [componentName]);

  const componentInstallUrls = {
    [componentName]: `@elements/${componentName}`,
  };

  return (
    <ComponentInstallDock
      selectedComponents={selectedComponents}
      componentInstallUrls={componentInstallUrls}
      category={category}
      name={providerName}
    />
  );
}

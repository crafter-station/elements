"use client";

import { useEffect, useState } from "react";

export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/crafter-station/elements")
      .then((res) => res.json())
      .then((data) => {
        if (data.stargazers_count) {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  if (stars === null) {
    return null;
  }

  // Format number (1234 -> 1.2k)
  const formatStars = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <span className="ml-1.5 tabular-nums font-medium">
      {formatStars(stars)}
    </span>
  );
}

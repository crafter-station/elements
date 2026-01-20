"use client";

import { GitHubActivityCalendar } from "@/registry/default/blocks/github/github-activity-calendar/components/elements/github-activity-calendar";

function generateDemoData() {
  const days = [];
  const year = new Date().getFullYear();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const current = new Date(startDate);
  while (current <= endDate) {
    const random = Math.random();
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (random > 0.6) level = 1;
    if (random > 0.75) level = 2;
    if (random > 0.88) level = 3;
    if (random > 0.95) level = 4;

    days.push({
      date: current.toISOString().split("T")[0],
      count: level * Math.floor(Math.random() * 5 + 1),
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
}

const DEMO_DATA = generateDemoData();

export default function GitHubActivityCalendarDemo() {
  return (
    <div className="flex items-center justify-center p-4 w-full overflow-x-auto">
      <GitHubActivityCalendar
        username="shadcn"
        staticData={DEMO_DATA}
        colorScheme="green"
      />
    </div>
  );
}

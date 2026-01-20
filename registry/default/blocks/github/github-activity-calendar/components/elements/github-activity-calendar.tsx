"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubActivityCalendarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  staticData?: ContributionDay[];
  year?: number;
  colorScheme?: "green" | "blue" | "purple" | "orange";
}

const LEVEL_COLORS = {
  green: [
    "bg-neutral-100 dark:bg-neutral-800",
    "bg-green-200 dark:bg-green-900",
    "bg-green-400 dark:bg-green-700",
    "bg-green-500 dark:bg-green-500",
    "bg-green-600 dark:bg-green-400",
  ],
  blue: [
    "bg-neutral-100 dark:bg-neutral-800",
    "bg-blue-200 dark:bg-blue-900",
    "bg-blue-400 dark:bg-blue-700",
    "bg-blue-500 dark:bg-blue-500",
    "bg-blue-600 dark:bg-blue-400",
  ],
  purple: [
    "bg-neutral-100 dark:bg-neutral-800",
    "bg-purple-200 dark:bg-purple-900",
    "bg-purple-400 dark:bg-purple-700",
    "bg-purple-500 dark:bg-purple-500",
    "bg-purple-600 dark:bg-purple-400",
  ],
  orange: [
    "bg-neutral-100 dark:bg-neutral-800",
    "bg-orange-200 dark:bg-orange-900",
    "bg-orange-400 dark:bg-orange-700",
    "bg-orange-500 dark:bg-orange-500",
    "bg-orange-600 dark:bg-orange-400",
  ],
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function generateCalendarData(year: number): ContributionDay[] {
  const days: ContributionDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const current = new Date(startDate);
  while (current <= endDate) {
    const random = Math.random();
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (random > 0.7) level = 1;
    if (random > 0.8) level = 2;
    if (random > 0.9) level = 3;
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

function getWeeksWithMonths(
  data: ContributionDay[]
): { weeks: ContributionDay[][]; monthLabels: { month: string; col: number }[] } {
  const weeks: ContributionDay[][] = [];
  const monthLabels: { month: string; col: number }[] = [];
  let currentWeek: ContributionDay[] = [];
  let lastMonth = -1;

  const firstDate = data[0] ? new Date(data[0].date) : new Date();
  const startDay = firstDate.getDay();

  for (let i = 0; i < startDay; i++) {
    currentWeek.push({ date: "", count: 0, level: 0 });
  }

  for (const day of data) {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    const month = date.getMonth();

    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    if (month !== lastMonth && dayOfWeek === 0) {
      monthLabels.push({ month: MONTHS[month], col: weeks.length });
      lastMonth = month;
    }

    currentWeek.push(day);
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }

  return { weeks, monthLabels };
}

export function GitHubActivityCalendar({
  username,
  staticData,
  year = new Date().getFullYear(),
  colorScheme = "green",
  className,
  ...props
}: GitHubActivityCalendarProps) {
  const [data, setData] = useState<ContributionDay[]>(staticData || []);
  const [loading, setLoading] = useState(!staticData);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    if (staticData) {
      setTotalContributions(staticData.reduce((sum, d) => sum + d.count, 0));
      return;
    }

    setLoading(true);
    const generated = generateCalendarData(year);
    setData(generated);
    setTotalContributions(generated.reduce((sum, d) => sum + d.count, 0));
    setLoading(false);
  }, [username, year, staticData]);

  const { weeks, monthLabels } = useMemo(
    () => getWeeksWithMonths(data),
    [data]
  );

  const colors = LEVEL_COLORS[colorScheme];

  if (loading) {
    return (
      <div
        data-slot="github-activity-calendar"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        <div className="h-[108px] w-full bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      data-slot="github-activity-calendar"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {totalContributions.toLocaleString()}
        </span>{" "}
        contributions in {year}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="flex gap-1 text-[10px] text-muted-foreground ml-8">
            {monthLabels.map(({ month, col }) => (
              <span
                key={`${month}-${col}`}
                className="absolute"
                style={{ marginLeft: col * 13 }}
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-1 mt-4">
            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground pr-1">
              {DAYS.filter((_, i) => i % 2 === 1).map((day) => (
                <span key={day} className="h-[10px] leading-[10px]">
                  {day}
                </span>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "w-[10px] h-[10px] rounded-sm",
                        day.date ? colors[day.level] : "bg-transparent"
                      )}
                      title={
                        day.date
                          ? `${day.count} contributions on ${day.date}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground justify-end">
            <span>Less</span>
            {colors.map((color, i) => (
              <div
                key={i}
                className={cn("w-[10px] h-[10px] rounded-sm", color)}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

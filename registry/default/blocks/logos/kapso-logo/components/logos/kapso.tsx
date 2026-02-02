const COLORS = {
  brand: {
    light: "#16A34A",
    dark: "#22C55E",
  },
  grayscale: {
    light: "#000000",
    dark: "#FFFFFF",
  },
} as const;

export function KapsoLogo({
  className,
  variant = "wordmark",
  colorScheme = "brand",
  mode = "light",
}: {
  className?: string;
  variant?: "icon" | "wordmark" | "logo";
  colorScheme?: "brand" | "grayscale";
  mode?: "dark" | "light";
}) {
  const color = COLORS[colorScheme][mode];

  // Simple icon - a messaging symbol
  const icon = (
    <g>
      <rect
        x="8"
        y="8"
        width="48"
        height="32"
        rx="8"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      <path
        d="M20 20h24M20 28h16"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="52" cy="40" r="4" fill={color} />
    </g>
  );

  if (variant === "icon") {
    return (
      <svg
        role="img"
        viewBox="0 0 64 48"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Kapso Icon</title>
        {icon}
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        role="img"
        viewBox="0 0 200 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <title>Kapso Wordmark</title>
        <text
          x="0"
          y="45"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="48"
          fontWeight="700"
          fill={color}
        >
          Kapso
        </text>
      </svg>
    );
  }

  // logo variant (icon + wordmark)
  return (
    <svg
      role="img"
      viewBox="0 0 280 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Kapso Logo</title>
      <g transform="translate(5, 10) scale(0.65)">{icon}</g>
      <text
        x="50"
        y="45"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="40"
        fontWeight="700"
        fill={color}
      >
        Kapso
      </text>
    </svg>
  );
}

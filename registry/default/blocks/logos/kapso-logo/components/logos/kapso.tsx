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

  // Simple icon - letter K
  const icon = (
    <g>
      <path
        d="M20 12v40M20 32l24-20M20 32l24 20"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
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

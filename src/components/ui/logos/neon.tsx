interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#37C38F",
  light: "#37C38F",
};

export function NeonLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Neon</title>
      <path
        fill={color}
        d="M64 0.0179162V64L39.0276 42.5475V64H0V0L64 0.0179162ZM7.84509 56.232H31.1825V25.502L56.1553 47.3788V7.78362L7.84509 7.7699V56.232Z"
      />
    </svg>
  );
}

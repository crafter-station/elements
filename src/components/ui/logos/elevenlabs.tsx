interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function ElevenlabsLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>ElevenLabs</title>
      <path fill={color} d="M4.6035 0v24h4.9317V0z" />
      <path fill={color} d="M9.8613 0v24h4.9317V0z" />
    </svg>
  );
}

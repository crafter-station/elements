interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function HyperbrowserLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 88 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Hyperbrowser</title>
      <path
        d="M64.4138 0.746582L0.727051 69.9314H35.2486C40.506 69.9314 45.1341 66.4632 46.6156 61.413L64.4138 0.746582Z"
        fill={color}
      />
      <path
        d="M41.4342 78.4479L23.636 139.116L87.3227 69.9312H52.8011C47.5437 69.9312 42.9156 73.3994 41.4342 78.4496V78.4479Z"
        fill={color}
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFCB05",
  light: "#1A1A1A",
};

export function BraintrustLogo({
  className,
  variant: _variant = "icon",
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
      <title>Braintrust</title>
      <path
        fill={color}
        d="M0 12.002C0 5.372 5.374-.002 12.001-.002C18.626-.002 24 5.372 24 12.002c0 6.625-5.374 12-11.999 12h-9.98a2.01 2.01 0 0 1-2.013-2.013V12.01zm0 0"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function ComposioLogo({
  className,
  variant: _variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 77 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Composio</title>
      <path
        d="M75.2058 25.0205L25.1809 14.7895C21.9009 14.1161 18.8164 16.6358 18.8164 19.981V43.6794V44.9393V68.6375C18.8164 71.9827 21.9009 74.5028 25.1809 73.8292L75.2058 63.5983"
        stroke={color}
        strokeWidth="2.53542"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

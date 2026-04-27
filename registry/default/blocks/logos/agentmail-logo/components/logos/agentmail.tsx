interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function AgentmailLogo({
  className,
  variant: _variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 350 363"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>AgentMail</title>
      <path
        d="M175 0L350 90V273L175 363L0 273V90L175 0Z"
        fill={color}
        opacity="0.15"
      />
      <path
        d="M30 110L175 40L320 110V180L175 250L30 180V110Z"
        fill="none"
        stroke={color}
        strokeWidth="18"
      />
      <path
        d="M30 110L175 185L320 110"
        fill="none"
        stroke={color}
        strokeWidth="18"
      />
      <path d="M175 185V250" fill="none" stroke={color} strokeWidth="18" />
      <path
        d="M120 290L175 210L230 290"
        fill="none"
        stroke={color}
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#F2F1F0",
  light: "#0D0E10",
};

export function SixtyfourLogo({
  className,
  variant: _variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Sixtyfour</title>
      <path
        d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      <path d="M32 4L32 60" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M8 18L56 18" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M8 46L56 46" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M32 4L8 18" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M32 4L56 18" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M8 18L8 46" stroke={color} strokeWidth="2" />
      <path d="M56 18L56 46" stroke={color} strokeWidth="2" />
      <path d="M8 46L32 60" stroke={color} strokeWidth="2" />
      <path d="M56 46L32 60" stroke={color} strokeWidth="2" />
      <path d="M20 11L20 53" stroke={color} strokeWidth="1" opacity="0.25" />
      <path d="M44 11L44 53" stroke={color} strokeWidth="1" opacity="0.25" />
      <path d="M8 32L56 32" stroke={color} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

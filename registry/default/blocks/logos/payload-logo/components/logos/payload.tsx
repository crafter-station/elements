interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#FFFFFF",
  light: "#000000",
};

export function PayloadLogo({
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
      <title>Payload</title>
      <path
        fill={color}
        d="M11.068 0 22.08 6.625v12.573L13.787 24V11.427L2.769 4.808 11.068 0ZM1.92 18.302l8.31-4.812v9.812l-8.31-5Z"
      />
    </svg>
  );
}

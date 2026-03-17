interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: "#F22F46",
  light: "#F22F46",
};

export function TwilioLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const color = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 68.3 68.3"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Twilio</title>
      <path
        fill={color}
        d="M34.1 0C15.3 0 0 15.3 0 34.1s15.3 34.1 34.1 34.1C53 68.3 68.3 53 68.3 34.1S53 0 34.1 0zm0 59.3C20.3 59.3 9 48 9 34.1 9 20.3 20.3 9 34.1 9 48 9 59.3 20.3 59.3 34.1 59.3 48 48 59.3 34.1 59.3z"
      />
      <circle fill={color} cx="42.6" cy="25.6" r="7.1" />
      <circle fill={color} cx="42.6" cy="42.6" r="7.1" />
      <circle fill={color} cx="25.6" cy="42.6" r="7.1" />
      <circle fill={color} cx="25.6" cy="25.6" r="7.1" />
    </svg>
  );
}

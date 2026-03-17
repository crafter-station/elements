interface LogoProps {
  className?: string;
  variant?: "icon";
  mode?: "dark" | "light";
}

const COLORS = {
  dark: {
    ring: "#FF5416",
    curve: "#FF8B60",
  },
  light: {
    ring: "#FF5416",
    curve: "#FF8B60",
  },
};

export function AblyLogo({
  className,
  variant = "icon",
  mode = "dark",
}: LogoProps) {
  const colors = COLORS[mode];

  return (
    <svg
      role="img"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Ably</title>
      <path
        fill={colors.ring}
        d="M27.1 18.6C14.6 18.6 4.4 28.8 4.4 41.3 4.4 53.8 14.6 64 27.1 64 39.6 64 49.8 53.8 49.8 41.3 49.8 28.8 39.7 18.6 27.1 18.6Zm0 32.8C21.5 51.4 17 46.9 17 41.3c0-5.6 4.5-10.1 10.1-10.1 5.6 0 10.1 4.5 10.1 10.1 0 5.6-4.5 10.1-10.1 10.1z"
      />
      <path
        fill={colors.curve}
        d="M18.3 16.9c-.2.1-.4.1-.6.1-1 0-1.9-.6-2.3-1.5l-4-8.7V7c-.1-.2-.2-.5-.2-.8 0-1 .6-1.8 1.4-2.3C16.8 1.2 21.9 0 27.1 0 45 0 59.6 14.5 59.6 32.5c0 9.5-4.1 18.1-10.7 24.1v0c-.1.1-.1.1-.2.1-.2 0-.3-.1-.3-.3 0-.1 0-.2.1-.2 3-4.3 4.6-9.5 4.6-14.8 0-14.3-11.6-26-26-26-3-.1-6 .5-8.8 1.5"
      />
    </svg>
  );
}
